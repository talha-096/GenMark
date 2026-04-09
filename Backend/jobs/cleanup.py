from core.extensions import db
from datetime import datetime, timedelta

def cleanup_old_content():
    """Deletes content created more than 30 days ago."""
    threshold = datetime.utcnow() - timedelta(days=30)
    # Using the 'posts' collection as defined in MarketingContent
    result = db.posts.delete_many({"created_at": {"$lt": threshold}})
    print(f"[Routine] Cleanup: Deleted {result.deleted_count} old content items.")
