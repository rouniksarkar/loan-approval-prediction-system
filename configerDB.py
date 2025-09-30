from pymongo import MongoClient
from config import MONGO_URI, DB_NAME
import certifi
import ssl

def create_mongo_client():
    """
    Create MongoDB client with proper SSL configuration for Atlas
    """
    try:
        # Option 1: Try with SSL certificates
        client = MongoClient(
            MONGO_URI,
            tls=True,
            tlsCAFile=certifi.where(),
            retryWrites=True,
            w='majority',
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
            serverSelectionTimeoutMS=30000
        )
        
        # Test connection
        client.admin.command('ping')
        print("✅ Connected to MongoDB Atlas with SSL!")
        return client
        
    except Exception as e:
        print(f"❌ SSL connection failed: {e}")
        
        try:
            # Option 2: Try without SSL certificate validation
            client = MongoClient(
                MONGO_URI,
                tls=True,
                tlsAllowInvalidCertificates=True,
                retryWrites=True,
                w='majority',
                connectTimeoutMS=30000,
                socketTimeoutMS=30000,
                serverSelectionTimeoutMS=30000
            )
            
            client.admin.command('ping')
            print("✅ Connected to MongoDB Atlas with relaxed SSL!")
            return client
            
        except Exception as e2:
            print(f"❌ All connection attempts failed: {e2}")
            raise

# Initialize MongoDB connection
try:
    client = create_mongo_client()
    db = client[DB_NAME]
    
    # Collections
    users_collection = db["users"]
    predictions_collection = db["predictions"]
    
    print(f"✅ Database '{DB_NAME}' initialized successfully!")
    
except Exception as e:
    print(f"❌ Failed to initialize database: {e}")
    raise