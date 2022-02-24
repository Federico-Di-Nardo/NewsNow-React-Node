# Database

The file database-script.sql contains a script to generate the whole database structure, with its tables and stored procedures.

## Structure

There are 4 tables:
  - user: stores user and password data to login
  - news: stores articles with all of their data
  - savedNews: combines users and articles to mark which user saved which articles
  - sessions: internal node-session table to store sessions

There are 3 stored procedures:
  - userSP
    - operations:
      - 01: Create
      - 02: Update
      - 03: Check if user/password is correct
      - 04: Delete
      - 06: Check if user (not password required) exists

  - newsSP
    - operations:
      - 01: Check if article exists. Create article or return existent article
      - 03: Get article by newsID
      - 04: Delete
      - 06: Check if article exists by URL

  - savedNewsSP
    - Validation: User must be logged to execute this SP
    - operations:
      - 01: Create association userID - NewsID
      - 03: Select one saved article by savedArticleID
      - 04: Delete. Unsave article
      - 08: Get list of user's saved articles

