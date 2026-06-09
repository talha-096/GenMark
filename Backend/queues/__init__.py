# queues/__init__.py
# This package manages background job queues for long-running AI tasks.
# Prevents HTTP timeouts by processing generation requests asynchronously.
#
# Files:
#   job_manager.py  →  Enqueue, dequeue, and track job status
#   worker.py       →  Worker process that consumes and executes queued jobs
