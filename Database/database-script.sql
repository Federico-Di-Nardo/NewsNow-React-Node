/****** Object:  Database [NewsNow]    Script Date: 22/02/2022 20:12:26 ******/
CREATE DATABASE [NewsNow]  (EDITION = 'Basic', SERVICE_OBJECTIVE = 'Basic', MAXSIZE = 2 GB) WITH CATALOG_COLLATION = SQL_Latin1_General_CP1_CI_AS;
GO
ALTER DATABASE [NewsNow] SET COMPATIBILITY_LEVEL = 150
GO
ALTER DATABASE [NewsNow] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [NewsNow] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [NewsNow] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [NewsNow] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [NewsNow] SET ARITHABORT OFF 
GO
ALTER DATABASE [NewsNow] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [NewsNow] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [NewsNow] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [NewsNow] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [NewsNow] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [NewsNow] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [NewsNow] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [NewsNow] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [NewsNow] SET ALLOW_SNAPSHOT_ISOLATION ON 
GO
ALTER DATABASE [NewsNow] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [NewsNow] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [NewsNow] SET  MULTI_USER 
GO
ALTER DATABASE [NewsNow] SET ENCRYPTION ON
GO
ALTER DATABASE [NewsNow] SET QUERY_STORE = ON
GO
ALTER DATABASE [NewsNow] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 7), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 10, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
/*** The scripts of database scoped configurations in Azure should be executed inside the target database connection. ***/
GO
-- ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 8;
GO
/****** Object:  User [serverlogin]    Script Date: 22/02/2022 20:12:27 ******/
CREATE USER [serverlogin] FOR LOGIN [serverlogin] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  DatabaseRole [db_executor]    Script Date: 22/02/2022 20:12:27 ******/
CREATE ROLE [db_executor]
GO
sys.sp_addrolemember @rolename = N'db_executor', @membername = N'serverlogin'
GO
sys.sp_addrolemember @rolename = N'db_datareader', @membername = N'serverlogin'
GO
sys.sp_addrolemember @rolename = N'db_datawriter', @membername = N'serverlogin'
GO
/****** Object:  Table [dbo].[news]    Script Date: 22/02/2022 20:12:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[news](
	[newsID] [int] IDENTITY(1,1) NOT NULL,
	[newsTitle] [nvarchar](1000) NOT NULL,
	[newsDescription] [nvarchar](max) NULL,
	[newsContent] [nvarchar](max) NULL,
	[newsAuthor] [nvarchar](100) NULL,
	[newsUrl] [nvarchar](500) NULL,
	[newsPublishedAt] [nvarchar](30) NULL,
	[newsImage] [nvarchar](2000) NULL,
	[creationDate] [smalldatetime] NOT NULL,
	[updateDate] [smalldatetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[savedNews]    Script Date: 22/02/2022 20:12:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[savedNews](
	[savedNewsID] [int] IDENTITY(1,1) NOT NULL,
	[userID] [int] NOT NULL,
	[newsID] [int] NOT NULL,
	[creationDate] [smalldatetime] NOT NULL,
	[updateDate] [smalldatetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sessions]    Script Date: 22/02/2022 20:12:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sessions](
	[sid] [varchar](255) NOT NULL,
	[session] [varchar](max) NOT NULL,
	[expires] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[sid] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user]    Script Date: 22/02/2022 20:12:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user](
	[userID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[password] [nvarchar](400) NOT NULL,
	[creationDate] [smalldatetime] NULL,
	[updateDate] [smalldatetime] NULL
) ON [PRIMARY]
GO
/****** Object:  StoredProcedure [dbo].[newsSP]    Script Date: 22/02/2022 20:12:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Federico Di Nardo>
-- Create date: <2022-02-15>
-- Description:	<insert, update, select and delete news>
-- =============================================
CREATE   PROCEDURE [dbo].[newsSP]
	@operation as nvarchar(02) = null,
	@newsID as int = null,
	@newsTitle as nvarchar(1000) = null,
	@newsDescription as nvarchar(max) = null,
	@newsContent as nvarchar(max) = null,
	@newsAuthor as nvarchar(100) = null,
	@newsPublishedAt as nvarchar(30) = null,
	@newsImage as nvarchar(2000) = null,
	@newsUrl as nvarchar(500) = null,

	@creationDate as smalldatetime = null,
	@updateDate as smalldatetime = null
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @errcod int = 0


-- ------------------------------------------------------------------------
--   0 1    -    C R E A T E
-- ------------------------------------------------------------------------
	IF @operation = '01'
		BEGIN
			BEGIN TRAN
		
			
			-- insert article if it doesn't already exist
			IF EXISTS (
				SELECT TOP 1 * FROM news 
				WHERE newsTitle = @newsTitle
				and newsAuthor= @newsAuthor
				and newsPublishedAt= @newsPublishedAt
				and newsImage= @newsImage
			)
				BEGIN
					SELECT TOP 1 newsID FROM news 
					WHERE newsTitle = @newsTitle
					and newsAuthor= @newsAuthor
					and newsPublishedAt= @newsPublishedAt
					and newsImage= @newsImage	
				END
			ELSE
				BEGIN
					INSERT INTO news(newsTitle, newsDescription, newsContent, newsAuthor, newsPublishedAt, newsImage, newsUrl, creationDate)
					VALUES (@newsTitle, @newsDescription, @newsContent, @newsAuthor, @newsPublishedAt, @newsImage, @newsUrl, getdate())
					SET @errcod = @@ERROR
					SET @newsID= @@IDENTITY
				END

		
			IF @errcod=0
				COMMIT TRAN
			ELSE
				ROLLBACK TRAN

			SELECT @newsID as newsID, @errcod as errcod

		END

-- ------------------------------------------------------------------------
--   0 3    -    G E T   A R T I C L E   B Y   I D 
-- ------------------------------------------------------------------------
	IF @operation = '03'
		BEGIN
			SELECT TOP 1 newsID, newsAuthor as author, newsContent as content, newsDescription as description, newsPublishedAt as publishedAt, newsTitle as title, newsUrl as url, newsImage as urlToImage
			FROM news 
			WHERE newsID = @newsID
		END
		


-- ------------------------------------------------------------------------
--   0 4    -    D E L E T E
-- ------------------------------------------------------------------------
	IF @operation = '04'
		BEGIN
			BEGIN TRAN

			DELETE FROM news
			WHERE newsID = @newsID
			SET @errcod=@@ERROR
		
			IF @errcod=0
				COMMIT TRAN
			ELSE
				ROLLBACK TRAN

			SELECT @newsID, @errcod as errcod
		END


-- ------------------------------------------------------------------------
--   0 6    -    C H E C K   I F   A R T I C L E   E X I S T S
-- ------------------------------------------------------------------------
	IF @operation = '06'
		BEGIN
			SELECT TOP 1 newsID 
			FROM news 
			WHERE newsUrl = @newsUrl
		END

END

GO
/****** Object:  StoredProcedure [dbo].[savedNewsSP]    Script Date: 22/02/2022 20:12:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Federico Di Nardo>
-- Create date: <2022-02-15>
-- Description:	<insert, update, select and delete relations between users and news (saved news)>
-- =============================================
CREATE   PROCEDURE [dbo].[savedNewsSP]
	@operation as nvarchar(02) = null,
	@savedNewsID as int = null,
	@userID as int = null,
	@username as nvarchar(50) = null,
	@newsID as int = null,
	@filter as nvarchar(max) = null,

	@creationDate as smalldatetime = null,
	@updateDate as smalldatetime = null
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @errcod int = 0



-- ------------------------------------------------------------------------
--   V A L I D A T I O N
-- ------------------------------------------------------------------------

	-- Get userID by username
	SELECT @userID = userID FROM [user] WHERE name = @username

	IF EXISTS (
		SELECT TOP 1 * FROM savedNews
		WHERE newsID = @newsID
		and userID = @userID
	)
		BEGIN
			SELECT TOP 1 savedNewsID 
			FROM savedNews
			WHERE newsID = @newsID
			and userID = @userID
			RETURN
		END

	IF @userID IS NULL
		SELECT 'E' as errtyp, -100 as errcod, 'You must be logged in to acces this section' as errtxt



-- ------------------------------------------------------------------------
--   0 1    -    C R E A T E
-- ------------------------------------------------------------------------
	IF @operation = '01'
		BEGIN
			BEGIN TRAN
		
			
			-- insert saved news (user - news)
			INSERT INTO savedNews(userID, newsID, creationDate)
			VALUES (@userID, @newsID, getdate())
			SET @errcod = @@ERROR
			SET @savedNewsID = @@IDENTITY
		
			IF @errcod=0
				COMMIT TRAN
			ELSE
				ROLLBACK TRAN

			SELECT @savedNewsID as savedNewsID, @errcod as errcod
		END


-- ------------------------------------------------------------------------
--   0 3    -    S E L E C T   O N E   A R T I C L E
-- ------------------------------------------------------------------------
	IF @operation = '03'
		BEGIN
			SELECT TOP 1 sn.savedNewsID, n.newsAuthor as author, n.newsContent as content, n.newsDescription as description, n.newsPublishedAt as publishedAt, n.newsTitle as title, n.newsUrl as url, n.newsImage as urlToImage
			FROM savedNews sn
			INNER JOIN news n ON sn.newsID=n.newsID
			WHERE savedNewsID = @savedNewsID
		END


-- ------------------------------------------------------------------------
--   0 4    -    D E L E T E
-- ------------------------------------------------------------------------
	IF @operation = '04'
		BEGIN
			BEGIN TRAN

			DELETE FROM savedNews
			WHERE savedNewsID = @savedNewsID
			SET @errcod=@@ERROR
		
			IF @errcod=0
				COMMIT TRAN
			ELSE
				ROLLBACK TRAN

			SELECT @savedNewsID as savedNewsID, @errcod as errcod
		END
END


-- ------------------------------------------------------------------------
--   0 8    -    G E T   L I S T   B Y   U S E R
-- ------------------------------------------------------------------------
	IF @operation = '08'
		BEGIN
			declare @sql as nvarchar(max) =
			'SELECT sn.savedNewsID, n.newsAuthor as author, n.newsContent as content, n.newsDescription as description, n.newsPublishedAt as publishedAt, n.newsTitle as title, n.newsUrl as url, n.newsImage as urlToImage
			FROM savedNews sn
			INNER JOIN news n ON sn.newsID = n.newsID
			WHERE userID = ' + QUOTENAME(@userID, '''')
			+ (CASE WHEN @filter IS NOT NULL THEN @filter ELSE '' END)
			+ ' ORDER BY sn.creationDate DESC'
			execute(@sql)
		END
GO
/****** Object:  StoredProcedure [dbo].[userSP]    Script Date: 22/02/2022 20:12:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Federico Di Nardo>
-- Create date: <2022-02-15>
-- Description:	<insert, update, select and delete users>
-- =============================================
CREATE   PROCEDURE [dbo].[userSP]
	-- Add the parameters for the stored procedure here
	@operation as nvarchar(02) = null,
	@userID as int = null,
	@name as nvarchar(50),
	@password as nvarchar(400) = null,

	@creationDate as smalldatetime = null,
	@updateDate as smalldatetime = null
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @errcod int = 0


-- ------------------------------------------------------------------------
--   0 1    -    C R E A T E
-- ------------------------------------------------------------------------
	IF @operation = '01'
		BEGIN
			BEGIN TRAN
		
			IF EXISTS (SELECT TOP 1 * FROM [user] WHERE name = @name)
				SELECT 'E' as errtyp, -4 as errcod, 'Username already taken' as errtxt
			ELSE
				BEGIN
					-- insert user
					INSERT INTO [user] (name, password, creationDate)
					VALUES (@name, @password, getdate())
					SET @errcod=@@ERROR
					SET @userID =@@IDENTITY
				END
		
			IF @errcod=0
				COMMIT TRAN
			ELSE
				ROLLBACK TRAN

			SELECT @userID, @errcod as errcod

		END


-- ------------------------------------------------------------------------
--   0 2    -    U P D A T E
-- ------------------------------------------------------------------------
	IF @operation = '02'
		BEGIN
			BEGIN TRAN

			UPDATE [user]
			SET password	= @password,
				updateDate	= GETDATE()
			WHERE userID = @userID
			SET @errcod=@@ERROR
		
			IF @errcod=0
				COMMIT TRAN
			ELSE
				ROLLBACK TRAN

			SELECT @userID, @errcod as errcod
		END

-- ------------------------------------------------------------------------
--   0 3    -    S E L E C T   B Y   N A M E   A N D   P A S S 
-- ------------------------------------------------------------------------
	IF @operation = '03'
		BEGIN
			IF EXISTS (SELECT TOP 1 * FROM [user] WHERE [name] = @name and [password] = @password)
				SELECT 'S' as errtyp, 0 as errcod
			ELSE
				SELECT 'E' as errtyp, -1 as errcod, 'Invalid user/password' as errtxt
		END

-- ------------------------------------------------------------------------
--   0 4    -    D E L E T E
-- ------------------------------------------------------------------------
	IF @operation = '04'
		BEGIN
			BEGIN TRAN

			DELETE FROM [user]
			WHERE userID = @userID
			SET @errcod=@@ERROR
		
			IF @errcod=0
				COMMIT TRAN
			ELSE
				ROLLBACK TRAN

			SELECT @userID, @errcod as errcod
		END
END


-- ------------------------------------------------------------------------
--   0 6    -    C H E C K   I F   U S E R   E X I S T S
-- ------------------------------------------------------------------------
	IF @operation = '06'
		BEGIN
			IF EXISTS (SELECT TOP 1 * FROM [user] WHERE name = @name)
				SELECT 'S' as errtyp, 0 as errcod
			ELSE
				SELECT 'E' as errtyp, -1 as errcod, 'Non-existant user' as errtxt
		END
GO
ALTER DATABASE [NewsNow] SET  READ_WRITE 
GO
