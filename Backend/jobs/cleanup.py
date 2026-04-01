from ..models.content import Content
from datetime import datetime, timedelta

def cleanup_old_content():
    """Deletes content created more than 30 days ago."""
    threshold = datetime.utcnow() - timedelta(days=30)
    result = Content.objects(created_at__lt=threshold).delete()
    print(f"[Routine] Cleanup: Deleted {result} old content items.")
