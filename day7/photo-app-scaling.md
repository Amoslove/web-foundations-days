
# SnapShare Photo App Scaling Plan

## 1. Assumptions and Traffic Estimates

SnapShare is a photo-sharing application where users upload photos and view a feed of photos from people they follow.

The following assumptions are used:

- Registered users: 10 million.
- Daily active users: 10% of registered users.
- Each active user uploads one photo per day.
- Each active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each thumbnail is 50 KB.
- One day has 86,400 seconds, and one year has 365 days.
- MB and KB use decimal units.
- Traffic is averaged across the full day, while peak feed traffic is estimated at five times the average.
- Storage estimates exclude backups, database metadata, and additional replicas.

### Daily Active Users

Daily active users = 10,000,000 × 10%

Daily active users = **1,000,000 users**

### Uploads Per Second

Daily uploads = 1,000,000 × 1

Daily uploads = 1,000,000 photos

Average uploads per second = 1,000,000 ÷ 86,400

Average uploads per second = **11.57 uploads per second**, or approximately 12.

### Feed Views Per Second

Daily feed views = 1,000,000 × 50

Daily feed views = 50,000,000 feed views

Average feed views per second = 50,000,000 ÷ 86,400

Average feed views per second = **578.70 feed views per second**, or approximately 579.

Peak feed views per second = 578.70 × 5

Peak feed views per second = **2,893.52 feed views per second**, or approximately 2,894.

### Photo Storage Per Year

Original photo storage per day = 1,000,000 × 2 MB = 2,000,000 MB = 2 TB.

Original photo storage per year = 2 TB × 365 = **730 TB**.

Thumbnail storage per day = 1,000,000 × 50 KB = 50 GB.

Thumbnail storage per year = 50 GB × 365 = **18.25 TB**.

Total photo storage per year = 730 TB + 18.25 TB = **748.25 TB per year**.

This estimate assumes every uploaded photo and its thumbnail are retained for the full year.

## 2. Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users view 50 feed pages per day but upload only one photo per day. Feed views greatly outnumber photo uploads.

The design should therefore focus on serving feed requests quickly by using a CDN, caching frequently requested data, and a database read replica. The system must still handle photo uploads reliably, but read performance is the main priority.

## 3. Where Photos Should Be Stored

Photo files should be stored in object storage rather than inside the database. Photos are large binary files, and storing them directly in the database would increase database size, backups, and storage costs while making database operations harder to manage.

Object storage is designed to store large files reliably and scale as the number of photos grows. The database should store photo information such as the photo ID, owner, caption, timestamp, and object-storage path, while the actual photo and thumbnail files remain in object storage.

## 4. Architecture Diagram

text
                       USERS
                          |
                          v
                    +-----------+
                    |    CDN    |
                    +-----------+
                     |         |
          Cached photos       | Feed/API requests
                     |         v
                     |   +-----------------+
                     |   | Load Balancer   |
                     |   +-----------------+
                     |           |
                     |           v
                     |   +-----------------+
                     |   |   App Servers   |
                     |   +-----------------+
                     |      |      |      |
                     |      |      |      +----------------+
                     |      |      |                       |
                     |      v      v                       v
                     |   +-------+ +----------------+  +----------+
                     |   | Cache | | Primary        |  |  Queue   |
                     |   +-------+ | Database       |  +----------+
                     |      |      +----------------+      |
                     |      |              |               v
                     |      |              v          +----------+
                     |      |      +----------------+ | Thumbnail|
                     |      |      | Read Replica   | | Worker   |
                     |      |      +----------------+ +----------+
                     |      |                              |
                     |      |                              v
                     +------+--------------------->+----------------+
                                                   | Object Storage |
                                                   | Originals and  |
                                                   | Thumbnails     |
                                                   +----------------+
```

## 5. What Each Component Does

- **CDN:** Delivers cached photos from locations closer to users, reducing loading time and traffic to the origin servers.
- **Load balancer:** Distributes incoming API requests across available app servers so that one server does not handle all the traffic.
- **App servers:** Handle user requests, authenticate users, validate uploads, and coordinate database, cache, queue, and storage operations.
- **Cache:** Keeps frequently requested feed data and metadata in fast memory to reduce repeated database queries.
- **Primary database:** Stores authoritative application data, including users, follows, photo records, captions, and timestamps.
- **Read replica:** Serves read queries so that the primary database can focus more on writes and authoritative updates.
- **Object storage:** Stores original photos and generated thumbnails without filling the database with large image files.
- **Queue:** Holds thumbnail-generation jobs so uploads do not have to wait for image processing to finish.
- **Thumbnail worker:** Takes jobs from the queue, creates smaller image versions, and saves the thumbnails to object storage.

## 6. Photo Upload Flow

1. A user selects a photo and submits it through the SnapShare application.
2. The app server authenticates the user and validates the file type, size, and upload permissions.
3. The original photo is uploaded to object storage, using a unique object key.
4. The app server creates a photo record in the primary database containing the photo ID, owner, timestamp, and storage key.
5. The app server places a thumbnail-generation job on the queue.
6. The app confirms the upload to the user once the original photo and essential database record are safely stored and the thumbnail job has been queued.
7. A thumbnail worker retrieves the job from the queue and downloads or reads the original photo from object storage.
8. The worker generates a 50 KB thumbnail and stores it in object storage under a separate key.
9. The worker updates the photo record or thumbnail status in the database when necessary.
10. When another user views the feed, the app retrieves feed metadata from the cache or read replica and returns image URLs.
11. The CDN delivers the original photo or thumbnail to the user, using object storage as the origin when the image is not already cached.

The thumbnail job can run in the background, so the user does not have to wait for image processing before the original upload is acknowledged.

## 7. Trade-Offs

### Trade-Off 1: Cache Speed vs. Data Freshness

Caching makes feed requests faster and reduces database load. However, cached information can become outdated after a user uploads a photo or changes who they follow. The system needs cache expiration or invalidation rules to keep feed information reasonably fresh.

### Trade-Off 2: Read Replica Performance vs. Consistency

A read replica reduces the load on the primary database and improves read capacity. However, replication can lag behind the primary database, meaning a new photo may not appear immediately in every feed. Important updates can be read from the primary database when immediate consistency is required.

### Trade-Off 3: Asynchronous Thumbnails vs. Immediate Availability

A queue allows uploads to finish without waiting for thumbnail generation and helps the system handle processing spikes. However, thumbnails may not be ready immediately, and failed jobs must be retried. The app should show the original photo or a placeholder until the thumbnail is available.

### Trade-Off 4: Object Storage and CDN vs. Cost and Complexity

Object storage and a CDN can handle large photo collections efficiently and reduce repeated requests to the origin. However, they introduce extra services, storage and bandwidth costs, and additional configuration for access permissions, caching, and file deletion.

## 8. Conclusion

SnapShare needs a read-heavy architecture that can serve thousands of feed requests per second while accepting photo uploads reliably. A CDN, cache, load balancer, app servers, primary database, read replica, object storage, queue, and thumbnail worker help separate responsibilities and scale different parts of the system independently. The estimated photo storage requirement is approximately 748.25 TB per year before backups and other overhead.