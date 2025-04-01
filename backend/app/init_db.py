import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def init_database():
    # First connect to 'postgres' database to be able to drop and create our database
    params = {
        "dbname": "postgres",  # Connect to default postgres database first
        "user": os.getenv("POSTGRES_USER", "postgres"),
        "password": os.getenv("POSTGRES_PASSWORD", "password"),
        "host": os.getenv("POSTGRES_HOST", "localhost"),
        "port": os.getenv("POSTGRES_PORT", "5432")
    }

    try:
        # Connect to default postgres database
        conn = psycopg2.connect(**params)
        conn.autocommit = True
        cursor = conn.cursor()

        # Drop database if it exists
        cursor.execute("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'hotel_management'
            AND pid <> pg_backend_pid();
        """)
        cursor.execute("DROP DATABASE IF EXISTS hotel_management")
        
        # Create database
        cursor.execute("CREATE DATABASE hotel_management")
        
        # Close connection to postgres database
        cursor.close()
        conn.close()

        # Connect to our newly created database
        params["dbname"] = "hotel_management"
        conn = psycopg2.connect(**params)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Read and execute the initialization SQL file
        print("Reading initialization SQL file...")
        with open(os.path.join(os.path.dirname(__file__), "../../SQL/initialization.sql"), "r", encoding='utf-8') as file:
            sql_commands = file.read()
            print("Executing SQL commands...")
            cursor.execute(sql_commands)

        # Create views
        print("Creating views...")
        
        # View 1: Number of available rooms per area
        cursor.execute("""
        CREATE OR REPLACE VIEW AvailableRoomsPerArea AS
        SELECT 
            SUBSTRING(Hotel.address FROM '^([^,]+)') AS area,
            COUNT(Room.roomNumber) AS available_rooms
        FROM Hotel
        JOIN Room ON Hotel.address = Room.hotelAddress
        WHERE Room.roomNumber NOT IN (
            SELECT roomNumber 
            FROM Booking 
            WHERE CURRENT_DATE BETWEEN startDate AND endDate
        )
        GROUP BY SUBSTRING(Hotel.address FROM '^([^,]+)');
        """)

        # View 2: Hotel room capacity
        cursor.execute("""
        CREATE OR REPLACE VIEW HotelRoomCapacity AS
        SELECT 
            Hotel.address AS hotel_address,
            Hotel.chainName AS hotel_chain,
            COUNT(Room.roomNumber) AS total_rooms,
            SUM(Room.capacity) AS total_capacity,
            AVG(Room.capacity)::numeric(10,2) AS average_room_capacity
        FROM Hotel
        JOIN Room ON Hotel.address = Room.hotelAddress
        GROUP BY Hotel.address, Hotel.chainName;
        """)

        print("Database and views initialized successfully!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    init_database() 