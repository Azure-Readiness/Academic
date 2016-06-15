<a name="HOLTitle"></a>
# Azure Storage and Cognitive Services #

---

<a name="Overview"></a>
## Overview ##

Microsoft Azure Storage is a set of services that allows you to store large volumes of data in a cost-effective manner and in a way that makes the data readily and reliably available to services and applications that consume it. Data committed to Azure Storage can be stored in blobs, tables, queues, or files. [Azure blobs](http://azure.microsoft.com/en-us/services/storage/blobs/) are ideal for storing images, videos, and other types of data, and are frequently used to provide input to and capture output from other Azure services such as [Azure Stream Analytics](http://azure.microsoft.com/en-us/services/stream-analytics/). [Azure tables](http://azure.microsoft.com/en-us/services/storage/tables/) provide NoSQL storage for semi-structured data. [Azure queues](http://azure.microsoft.com/en-us/services/storage/queues/) support queued message transfers between applications (or parts of applications) and can be used to make applications more scalable and robust by loosely coupling them together. Finally, [Azure Files](http://azure.microsoft.com/en-us/services/storage/files) use the Server Message Block (SMB) protocol to share files through the cloud and access storage as network drives.

Data stored in Microsoft Azure Storage can be accessed over HTTP or HTTPS using straightforward REST APIs, or it can be accessed using rich client libraries available for many popular languages and platforms, including .NET, Java, Android, Node.js, PHP, Ruby, and Python. The [Azure Portal](https://portal.azure.com) includes features for working with Azure Storage, but richer functionality is available from third-party tools, many of which are free and some of which work cross-platform.

In this lab, you will write an app that accepts images uploaded by users and stores the images in Azure blob storage. You will learn how to read and write blobs in Node.js, and how to use blob metadata to attach additional information to the blobs you create. You will also get first-hand experience using [Microsoft Cognitive Services](https://www.microsoft.com/cognitive-services/), a set of intelligent APIs for building equally intelligent applications. Specifically, you'll submit each image uploaded by the user to Cognitive Services' [Computer Vision API](https://www.microsoft.com/cognitive-services/en-us/computer-vision-api) to generate a caption for the image as well as searchable metadata describing the contents of the image. Along the way, you'll discover how easy it is to deploy apps to the cloud using Git and Visual Studio Code.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Create a storage account and containers using the Azure Portal
- Write a Node.js app in Visual Studio Code and deploy it to Azure using Git
- Read and write blobs and attach metadata to them
- Use the Computer Vision API to extract information from images
- Use the cross-platform [Microsoft Azure Storage Explorer](http://storageexplorer.com/) to work with Azure Storage

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- A Microsoft Azure subscription - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)
- Visual Studio Code (provided for you in the lab VM)
- Git version 2.0 or higher (provided for you in the lab VM)
- Node.js version 4 or higher (provided for you in the lab VM)
- The Microsoft Azure Storage Explorer (provided for you in the lab VM)

---
<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create a storage account](#Exercise1)
- [Exercise 2: Run the Microsoft Azure Storage Explorer](#Exercise2)
- [Exercise 3: Get a subscription key for the Computer Vision API](#Exercise3)
- [Exercise 4: Write the app in Visual Studio Code](#Exercise4)
- [Exercise 5: Test the app in your browser](#Exercise5)
- [Exercise 6: Deploy the app to Azure](#Exercise8)

Estimated time to complete this lab: **60** minutes.

<a name="Exercise1"></a>
## Exercise1: Create a storage account

The [Azure Portal](https://portal.azure.com) allows you to perform basic storage operations such as creating storage accounts, creating containers, and managing access keys. In this exercise, you will use the portal to create a storage account. Then you'll create a pair of containers: one to store images uploaded by the user, and another to store image thumbnails generated from the uploaded images.

1. Go to the [Azure Portal](https://portal.azure.com/) and sign in using your Microsoft account.
 
1. The first step in using Azure Storage is to create a storage account. To create a storage account, click **+ NEW** in the ribbon on the left. Then click **Data + Storage**, followed by **Storage account**.

    ![Creating a storage account](images/new-storage-account.png)

    _Creating a storage account_

1. In the ensuing "Create storage account" blade, enter a name for the new storage account in **Name** field. The name is important, because it forms one part of the URL through which blobs created under this account can be accessed.

	> Storage account names can be 3 to 24 characters in length and can only contain numbers and lowercase letters. In addition, the name you enter must be unique within Azure; if someone else has chosen the same name, you'll be notified that the name isn't available with a red exclamation mark in the **Name** field.

	Once you have a name that Azure will accept (as indicated by the green check mark in the **Name** field), make sure **Resource Manager** is selected as the deployment model and **+ New** is selected under **Resource group**. Then type "Intellipix" (without quotation marks) into the **New resource group name** box.

	> Resource groups are a relatively recent addition to Azure and are a powerful construct for grouping resources such as storage accounts, databases, and virtual machines together so they can be managed as a unit. Imagine that you created a complex application consisting of multiple storage accounts, a cluster of VMs, a SQL database, and perhaps a Stream Analytics solution and a pair of event hubs. Now you want to create a new instance of the application using a different account. By assembling all these resources into a resource group, you can take advantage of [Azure deployment templates](https://azure.microsoft.com/en-us/documentation/articles/arm-template-deployment/) to script the creation of the entire application. In addition, you can use role-based security to restrict access to resources in a resource group, and you can delete the application — and all of the resources that comprise it — by deleting the resource group. You will learn more about resource groups and deployment templates in subsequent labs.

	> The other deployment model, **Classic**, creates a "classic" storage account that doesn't fall under the purview of the [Azure Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/). Specifying **Resource Manager** as the deployment model provides you with more flexibility later on by ensuring that the account is explicitly added to a resource group, and it makes the storage account a first-class citizen in the Azure environment. For more information, see [Understanding Resource Manager deployment and classic deployment](https://azure.microsoft.com/en-us/documentation/articles/resource-manager-deployment-model/).

	Make sure **General purpose** is selected in the **Account Kind** box. Then select **Locally-redundant storage (LRS)** under **Replication**.

	> Locally redundant storage is the most cost-effective storage option. It prevents data stored under this storage account from being replicated in other data centers, but it ensures that the data will be replicated at least three times within the chosen data center. A *general-purpose* storage account can contain tables and queues as well as blobs, while the other type of storage account — *blob storage* — hosts blobs only. The latter could be used for this lab, and it offers support for a new feature of Azure called [cool storage](https://azure.microsoft.com/en-us/blog/introducing-azure-cool-storage/). But since not all Azure data centers support blob-only storage accounts right now, selecting it would limit the places your storage account can be located.

	Finish up by selecting the location nearest you in the **Location** box. Then click the **Create** button at the bottom of the blade to create the new storage account.
    
	![Specifying parameters for a new storage account](images/create-storage-account.png)

    _Specifying parameters for a new storage account_

1. After a few moments (it generally takes just a few seconds, but can sometimes take a few minutes), the new storage account will be created. Click **Storage accounts** in the ribbon on the left to see a list of storage accounts associated with your subscription.
 
    ![Viewing a list of storage accounts](images/view-storage-accounts.png)

    _Viewing a list of storage accounts_

1. Click the storage account that you just created.

    ![Viewing a storage account](images/view-storage-account.png)

    _Viewing a storage account_

1. In the blade for the storage account, click **Blobs** to view a list of containers associated with this account.

    ![Viewing blob containers](images/view-containers.png)

    _Viewing blob containers_

1. The storage account currently has no containers. Before you can create a blob, you must create a container to store it in. Click **+ Container** to create a new container.

    ![Adding a container](images/add-container.png)

    _Adding a container_

1. Type "photos" (without quotation marks) into the **Name** field and select **Blob** as the **Access type**. Then click **Create** to create a container named "photos."

	> By default, containers and their contents are private. Selecting **Blob** as the access type makes the blobs in the "photos" container publicly accessible, but doesn't make the container itself public. This is what you want since the images stored in the "photos" container will be linked to from a Web app. 

    ![Creating a "photos" container](images/create-photos-container.png)

    _Creating a "photos" container_

1. Repeat this process to create a container named "thumbnails," once more ensuring that the container's **Access type** is set to **Blob**.

    ![Creating a "thumbnails" container](images/create-thumbnails-container.png)

    _Creating a "thumbnails" container_

1. Confirm that both containers appear in the list of containers for this storage account, and that the names are spelled correctly.

    ![The new containers](images/new-containers.png)

    _The new containers_

You have now created a storage account to hold images uploaded to the app you're going to build, and containers to store the images in. Note that you *could* create these containers from within the app. Whether to create them programmatically or create them as part of the provisioning process is a choice that's left up to app developers.

<a name="Exercise2"></a>
## Exercise 2: Run the Microsoft Azure Storage Explorer

The [Microsoft Azure Storage Explorer](http://storageexplorer.com/) is a free tool that provides a graphical interface for working with Azure Storage on PCs running Windows, OS X, and Linux. It provides most of the same functionality as the Azure Portal. It also offers features the portal does not, such as the ability to upload blobs to Azure Storage and view blob metadata. In this exercise, you will use the Microsoft Azure Storage Explorer to view the containers you created in Exercise 1.

1. Start the Microsoft Azure Storage Explorer.

1. In the Storage Explorer window, click **Connect to Microsoft Azure**.

    ![Connecting Storage Explorer to Azure](images/storage-explorer-connect-to-azure.png)

    _Connecting Storage Explorer to Azure_

1. Enter the e-mail address for your Microsoft account. Then click **Continue**.

    ![Entering your e-mail address](images/storage-explorer-enter-email.png)

    _Entering your e-mail address_

1. Enter the user name and password for your Microsoft account. Check the box labeled **Keep me signed in**. Then click the **Sign in** button.

    ![Signing in to Storage Explorer](images/storage-explorer-enter-credentials.png)

    _Signing in to Storage Explorer_

1. Confirm that the storage account you created in Exercise 1 appears in the list of storage accounts shown in Storage Explorer. Click the small arrow next to the storage account to display its contents, and then click the arrow next to **Blob Containers**. Confirm that the containers you created in Exercise 1 appear in the list of containers.

    ![The Microsoft Azure Storage Explorer](images/storage-explorer.png)

    _The Microsoft Azure Storage Explorer_

The containers are currently empty, but that will change once your app is deployed and you start uploading photos. Having Storage Explorer installed will make it easy for you to see what your app writes to blob storage.

<a name="Exercise3"></a>
## Exercise 3: Get a subscription key for the Computer Vision API

[Microsoft Cognitive Services](https://www.microsoft.com/cognitive-services/) is a set of intelligence APIs that you can call from your apps. Among the more than 20 APIs it offers are the [Computer Vision API](https://www.microsoft.com/cognitive-services/en-us/computer-vision-api) for distilling actionable information from images, the [Emotion API](https://www.microsoft.com/cognitive-services/en-us/emotion-api) for recognizing emotion in images and video, and the [Text Analytics API](https://www.microsoft.com/cognitive-services/en-us/text-analytics-api) for extracting sentiments and other information from text (for example, Twitter feeds). These APIs make it possible to build smart apps that would have been impossible just a few short years ago. And they're available in preview form for you to begin using today.

In this exercise, you will acquire a subscription key allowing you to call the Computer Vision API from your code. You'll use this key in Exercise 4 to generate thumbnails from the images uploaded to the Web site, and also to generate captions and searchable metadata for the images.

1. In order to use the Computer Vision API, you need to sign up for a free account and acquire a subscription key. To do that, point your browser to [https://www.microsoft.com/cognitive-services/en-us/subscriptions](https://www.microsoft.com/cognitive-services/en-us/subscriptions).

1. If you are asked to sign in, do so with your Microsoft account.

1. Click **Yes** when asked if this app can access your info.

    ![Approving access to personal info](Images/access-your-info.png)

    _Approving access to personal info_

1. Scroll down until you find **Computer Vision**. Then check the box next to it.

    ![Requesting access to the Computer Vision API](Images/check-computer-vision.png)

    _Requesting access to the Computer Vision API_

1. Scroll to the bottom of the page. Check the box to agree to the terms and privacy statement, and then click the **Subscribe** button.

    ![Subscribing to the Computer Vision API](Images/subscribe.png)

    _Subscribing to the Computer Vision API_

1. Click **Copy** under **Key 1** to copy your Computer Vision subscription key to the clipboard.

    ![Copying the subscription key to the clipboard](Images/computer-vision-key.png)

    _Copying the subscription key to the clipboard_

<a name="Exercise4"></a>
## Exercise 4: Write the app in Visual Studio Code

In this exercise, you will create a new Node.js app in Visual Studio Code and add code to upload images, write them to blob storage, display them in a Web page, generate captions and keywords using the Computer Vision API, and perform keyword searches on uploaded images. The app will be named Intellipix (for "Intelligent Pictures") and will be accessed through your browser. 

1. Create a project directory named "Intellipix" for the lab in the location of your choice — for example, "C:\DXLabs\Intellipix."

1. Open a Command Prompt window and execute the following command, substituting the Computer Vision API key you copied to the clipboard in the previous exercise for *vision_api_key*:

	<pre>
	set AZURE_VISION_API_KEY=<i>vision_api_key</i>
	</pre>

1. Next, execute the following command, substituting the name of the storage account you created in Exercise 1 for *storage_account_name*:

	<pre>
	set AZURE_STORAGE_ACCOUNT=<i>storage_account_name</i>
	</pre>

1. Return to the Azure Portal for a moment and open the blade for the storage account you created in Exercise 1. Then click the key icon near the top of the blade. 

    ![Viewing the storage account's access keys](Images/view-access-keys.png)

    _Viewing the storage account's access keys_

1. Click the **Copy** button to the right of **key1** to copy the access key to the clipboard.

    ![Copying the storage account's access key](Images/copy-access-key.png)

    _Copying the storage account's access key_

1. Return to the Command Prompt window and type the following command, replacing *storage_account_key* with the access key on the clipboard:

	<pre>
	set AZURE_STORAGE_ACCESS_KEY=<i>storage_account_key</i>
	</pre>

1. In the Command Prompt window, **navigate to the Intellipix directory you created in Step 1** and execute the following command (note the space and the period at the end of the command) to start Visual Studio Code in that directory:

	<pre>
	code .
	</pre>

1. In Visual Studio Code, click the **Git** button in the ribbon on the left.

    ![The Git button in Visual Studio Code](images/node-git-button.png)

    _The Git button in Visual Studio Code_

1. Click **Initialize git repository** to initialize a Git repository in the working directory and place the directory under source control.

    ![Initializing a Git repository](images/node-initialize-git-repository.png)

    _Initializing a Git repository_

1. Return to the Command Prompt window and make sure you're still in the directory that you created for the project (the directory that was just placed under source control). Then execute the following command to initialize the project. When prompted for an author name, enter your name.

	<pre>
	npm init -y
	</pre> 

1. Now execute the following command to install the NPM packages that the app will use:

	<pre>
    npm install -save azure-storage express multer request streamifier
	</pre> 

1. Return to Visual Studio Code and click the **Explorer** button in the upper-left corner. Then click **package.json** to open that file for editing.

    ![Opening package.json for editing](images/node-edit-package-json.png)

    _Opening package.json for editing_

1. Add the following statements to package.json just before the "keywords" definition. Then save your changes.

	```json
	"engines": {
	  "node": ">=4.0"
	},
	```

1. Place the mouse cursor over "INTELLIPIX" in the Explorer window and click the **New File** button that appears. Name the new file ".gitignore" (without quotation marks). Be sure to include the leading period in the file name.

    ![Adding a file](images/node-add-file.png)

    _Adding a file_

1. Add the following statements to .gitignore to exclude the specified directories from source control:

    <pre>
	.vscode/
	node_modules/
	</pre>

1. Add a file named server.js to the project and insert the following statements:

	```javascript
var express = require('express');
    var multer = require('multer');
    var azureStorage = require('azure-storage');
    var streamifier = require('streamifier');
    var request = require('request');

    var portNum = process.env.PORT || 9898;

    var app = express();
    var storage = multer.memoryStorage();
    var uploadImage = multer({ storage: storage }).single('imageFile');

    app.post('/api/image-upload', configurationMiddleware, uploadImage, imageHandlerMiddleware);
    app.get('/api/images', configurationMiddleware, noCacheMiddleware, listBlobsMiddleware);
    app.use('/', express.static('src'));
    app.use(errorHandlerMiddleware);

    app.listen(portNum, function() {
        console.log("Web application listening on port " + portNum);
    });

    function configurationMiddleware(req, res, next) {

        var verifyConfigValue = function(keyName) {
            var configValue = process.env[keyName];
            if(!configValue) {
                throw new Error(keyName + " not defined.");
            }
            return configValue;
        };

        req.appConfig = {
            storageAccount: verifyConfigValue("AZURE_STORAGE_ACCOUNT"),
            storageAccountAccessKey: verifyConfigValue("AZURE_STORAGE_ACCESS_KEY"),
            visionApiKey: verifyConfigValue("AZURE_VISION_API_KEY")
        };
        next();
    }

    function imageHandlerMiddleware(req, res) {

        // Note, all of this work is done in memory!!

        var cfg = req.appConfig;
        var uploadFile = req.file;
        var blobService = azureStorage.createBlobService(cfg.storageAccount, cfg.storageAccountAccessKey);
        var publicUrl = [
            "https://",
            cfg.storageAccount,
            ".blob.core.windows.net/photos/",
            uploadFile.originalname
        ].join('');

        console.log(["Received ", uploadFile.originalname, " (", uploadFile.size, " bytes)"].join(''));
        saveImageToAzure(uploadFile);

        function saveImageToAzure() {
            blobService.createBlockBlobFromStream(
                'photos',
                uploadFile.originalname,
                streamifier.createReadStream(uploadFile.buffer),
                uploadFile.size,
                function(err, result, response) {
                    if(err){
                        throw err;
                    }
                    console.log(["Uploaded ", uploadFile.originalname, " image to 'photos' container on Azure."].join(''));
                    console.log(["URL: ", publicUrl].join(''));
                    createThumbnailOfImage();
                });
        }

    function createThumbnailOfImage(){
        var options = {
            url: "https://api.projectoxford.ai/vision/v1.0/generateThumbnail",
            qs: {
                width: 192,
                height: 128,
                smartCropping: true
            },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': cfg.visionApiKey
            },
            json: true,
            body: {
                url: publicUrl
            }
        };
        request(options)
            .on('error', function(err) {
                throw err;
            })
            .on('end', function() {
                console.log(["Created ", uploadFile.originalname, " thumbnail."].join(''));
            })
            .pipe(saveThumbnailToAzure());
        }

        function saveThumbnailToAzure() {
            return blobService
                .createWriteStreamToBlockBlob('thumbnails', uploadFile.originalname)
                .on('error', function(err) {
                    throw err;
                })
                .on('end', function() {
                    console.log(["Uploaded ", uploadFile.originalname, " image to 'thumbnails' container on Azure."].join(''));
                    analyzeImage();
                });
        }

        function analyzeImage() {
            var options = {
                url: "https://api.projectoxford.ai/vision/v1.0/analyze",
                qs: {
                    visualFeatures: "Description"
                },
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': cfg.visionApiKey
                },
                json: true,
                body: {
                    url: publicUrl
                }
            };
            request(options, function(err, response, body) {
                if(err) {
                    throw err;
                }
                console.log(["Analyzed ", uploadFile.originalname].join(''));
                saveAnalysisResults(body);
            });
        }

        function saveAnalysisResults(result) {
            var metaData = {
                caption: result.description && result.description.captions && result.description.captions.length ?
                    result.description.captions[0].text :
                    "Unknown",
                tags: result.description && result.description.tags && result.description.tags.length ?
                    JSON.stringify(result.description.tags) :
                    []
            };

            blobService.setBlobMetadata(
                'photos',
                uploadFile.originalname,
                metaData,
                function(err, result, response) {
                    if(err){
                        throw err;
                    }
                    console.log(["Stored ", uploadFile.originalname, " analysis results to Azure."].join(''));
                    res.status(200).send({
                        name: uploadFile.originalname,
                        mimetype: uploadFile.mimetype,
                        result: result
                    });
                });
        }
    }

    function listBlobsMiddleware(req, res) {
        var cfg = req.appConfig;
        var blobService = azureStorage.createBlobService(cfg.storageAccount, cfg.storageAccountAccessKey);
        var options = {
            maxResults: 5000,
            include: "metadata",

        };
        blobService.listBlobsSegmented(
            'photos',
            null,
            options,
            function(err, result, response) {
                if(err) {
                    throw err;
                }
                (result.entries || []).forEach(function(entry) {
                    entry.url = [
                        "https://",
                        cfg.storageAccount,
                        ".blob.core.windows.net/thumbnails/",
                        entry.name
                    ].join("");
                    entry.fullUrl = [
                        "https://",
                        cfg.storageAccount,
                        ".blob.core.windows.net/photos/",
                        entry.name
                    ].join("");
                    entry.metadata = entry.metadata || {};
                });
                res.status(200).json(result);
            }
        )
    }

    function noCacheMiddleware(req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
    }

    function errorHandlerMiddleware(err, req, res, next) {
        console.error(err);
        res.status(500).send({
            error: true,
            message: err.toString()
        });
    }
	```
	
	> Add description

1. Place the mouse cursor over "INTELLIPIX" in Visual Studio Code's Explorer window and click the **New Folder** button that appears. Name the new folder "src" (without quotation marks).

    ![Adding a folder](images/node-add-folder.png)

    _Adding a folder_

1. Add a file named index.html to the src folder and insert the following statements:

	```html
<!DOCTYPE html>
    <html lang="en" ng-app="myApp">
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Intellipix</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .ng-cloak { display: none !important; }
        a img {
        cursor: pointer;
        }
        .image-modal img {
        width: 100%;
        }
    </style>
    </head>
    <body class="ng-cloak">

    <div class="container body-content" ng-controller="mainCtrl as ctrl">

        <h1>Intellipix</h1>

        <!-- Panel containing image-upload and search controls -->
        <div class="well">
        <form ng-if="!ctrl.analysis.inProgress">
            <div class="row">
            <div class="col-md-7">
                <div class="form-group">
                <label for="imageFile">Select Image to Analyze:</label>
                <input type="file" id="imageFile" name="imageFile" on-file-selected="ctrl.imageFileSelected(file)">
                </div>
            </div>
            <div class="col-md-5">
                <div class="form-group">
                <label for="searchText">Search:</label>
                <div class="input-group">
                    <input type="text" id="searchText" ng-model="ctrl.searchText" class="form-control">
                    <span class="input-group-btn">
                    <button class="btn btn-default" type="button" ng-click="ctrl.clearSearchText()">
                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </button>
                    </span>
                </div>
                </div>
            </div>
            </div>
        </form>
        <p ng-if="ctrl.analysis.inProgress">
            <span class="glyphicon glyphicon-time" aria-hidden="true"></span>
            Analyzing Image ...
        </p>
        </div>

        <!-- Panel showing error message if upload or image analysis fails -->
        <div class="alert alert-danger alert-dismissible" role="alert" ng-if="ctrl.analysis.error">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        {{ctrl.analysis.error.message}}
        </div>

        <!-- Thumbnail images -->
        <div class="row">
        <div class="col-sm-12">
            <a ng-click="ctrl.showImageDetails(img)" ng-repeat="img in ctrl.images | filter:ctrl.imageFilter">
                <img ng-src="{{img.url}}" width="192" ng-attr-title={{img.metadata.caption}} style="padding-right: 16px; padding-bottom: 16px">
            </a>
        </div>
        </div>

        <!-- Modal window used to show enlarged images -->
        <div class="modal fade image-modal" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">{{ctrl.current.metadata.caption}}</h4>
            </div>
            <div class="modal-body">
                <img ng-src="{{ctrl.current.fullUrl}}">
            </div>
            </div>
        </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.6/angular.min.js"></script>
    <script src="index.js"></script>

    </body>
    </html>
	```

	> Add description

1. Add a file named index.js to the src folder and insert the following statements:

	```javascript
(function() {

        function mainController($http) {
            this.$http = $http;
            this.analysis = {
                inProgress: false
            };
            this.images = [];
            this.current = null;
            this.searchText = '';
            this.imageFilter = imageFilter.bind(this);
            this.loadImageList();

            function imageFilter(img) {
                var search = this.searchText;
                var tags = img && img.metadata && img.metadata.tags;

                if(!search || !tags) {
                    return true;
                }

                if (containsText(tags, search)) {
                    return true;
                }

                return false;
            }
        }
        mainController.prototype = {

            clearSearchText: function() {
                this.searchText = '';
            },

            imageFileSelected: function(file) {
                var ctrl = this, formData;
                ctrl.analysis = {
                    inProgress: true
                };
                formData = new FormData();
                formData.append('imageFile', file);
                ctrl.$http
                    .post('/api/image-upload', formData, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .then(function(result) {
                        ctrl.analysis = {
                            inProgress: false,
                            result: result.data
                        };
                        ctrl.loadImageList();
                    })
                    .catch(function(err) {
                        ctrl.analysis = {
                            inProgress: false,
                            error: err.data || { message: err.statusText }
                        };
                    });
            },

            loadImageList: function() {
                var ctrl = this;
                ctrl.$http.get('/api/images')
                    .then(function(result) {
                        ctrl.images = result.data.entries || [];
                    })
                    .catch(function(err) {
                        alert((err.data && err.data.message) || err.toString());
                    });
            },

            showImageDetails: function(img) {
                this.current = img;
                angular.element("#imageModal").modal();
            }
        };

        function fileContentBinderDirective() {
            return {
                restrict: 'A',
                scope: {
                    onFileSelected: '&'
                },
                link: function(scope, element) {
                    element.on('change', function() {
                        scope.$apply(function() {
                            scope.onFileSelected({
                                file: element[0].files[0]
                            });
                        });
                    });
                }
            };
        }

        function containsText(text, search) {
            return (text && search) ? (text.toLowerCase().indexOf(search.toLowerCase()) > -1) : false;
        }

        angular
            .module('myApp', [])
            .controller('mainCtrl', ['$http', mainController])
            .directive('onFileSelected', [fileContentBinderDirective]);

    }());
	```

	> Add description

With the code in place, the next task is to run it and test it in your browser.

<a name="Exercise5"></a>
## Exercise 5: Test the app in your browser

Now it's time to test the app.

1. Return to the Command Prompt window and, once more, make sure you're in the Intellipix directory that you created for the project. Then execute the following command to start server.js:

	<pre>
	node server.js
	</pre>

1. Open your browser and navigate to [http://localhost:9898/](http://localhost:9898/).

1. Click the **Browse** button and upload one of the images found in the "resources/photos" folder of this lab. After a few seconds, a thumbnail version of the photo appears on the page:

    ![Intellipix with one photo uploaded](Images/node-one-photo-uploaded.png)

    _Intellipix with one photo uploaded_

1. Upload a few more images from this lab's "resources/photos" folder. Confirm that they appear on the page, too:

    ![Intellipix with three photos uploaded](Images/node-three-photos-uploaded.png)

    _Intellipix with three photos uploaded_

1. Hover the cursor over one of the image thumbnails. Confirm that a tooltip window appears containing a caption for the image. *This is the caption that was generated by the Computer Vision API and stored in blob metadata*.

    ![The computer-generated caption](Images/node-thumbnail-with-tooltip.png)

    _The computer-generated caption_

1. Click the thumbnail to display the original image in a lightbox. Confirm that the computer-generated caption appears at the top of the lightbox. Then dismiss the lightbox.

    ![Lightbox with computer-generated caption](Images/node-lightbox-with-caption.png)

    _Lightbox with computer-generated caption_

1. Upload several more photos. **Feel free to upload photos of your own**, not just the ones provided with the lab.

    ![Intellipix after uploading several images](Images/node-several-images-uploaded.png)

    _Intellipix after uploading several images_

1. Type a keyword such as "river" into the search box. Search results will vary depending on what you typed and what images you uploaded. But the result should be a filtered list of images — images whose metadata keywords include all or part of the keyword that you typed.

    ![Performing a search](Images/node-search-results.png)

    _Performing a search_

1. Return to the Microsoft Azure Storage Explorer (or restart if it you didn't leave it running) and double-click the "photos" container under the storage account you created in Exercise 1. The number of blobs in the container should equal the number of photos you uploaded. Double-click one of the blobs to download it and see the image stored in the blob.

    ![Contents of the "photos" container](Images/photos-container.png)

    _Contents of the "photos" container_

1. Open the "thumbnails" container in Storage Explorer. How many blobs do you see there? Open one of the blobs to see what's inside. These are the thumbnail images generated from the image uploads.

1. Want to see where the metadata generated by the Computer Vision API is being stored? Use the Azure Storage Explorer to open the "photos" container. Right-click any of the blobs in the container and select **Properties**. In the ensuing dialog, you'll see a list of the metadata attached to the blob. Each metadata item is a key-value pair. The computer-generated caption is stored in the item named "caption," while the keywords generated from the image are stored in a serialized JSON array of strings named "tags."

    ![Blob metadata](Images/node-blob-metadata.png)

    _Blob metadata_

	When you're finished, click **Cancel** to close the Properties dialog.

1. Do a **View Source** in your browser to view the source for the page. Find the \<img\> elements representing the image thumbnails. Observe that the URLs assigned to the images refer **directly to blobs in blob storage**. This is possible because you set the containers' **Access type** to **Blob**, which makes the blobs inside them publicly accessible.

	> What would happen if the containers were private? If you're not sure, try it and see. Temporaily change the "thumbnails" container's **Access type** to **Private** in the Azure Portal. Then refresh the Intellipix page in your browser and see what happens.

You're almost finished, but the final and most important step remains. It is time to deploy the app to the cloud.

<a name="Exercise6"></a>
## Exercise 6: Deploy the app to Azure

In this exercise, you will create an Azure Web App and deploy Intellipix to it using Git. Up to now, you have been running the app locally. Azure Web Apps support local Git repositories as deployment sources, which makes it incredibly easy to [publish the contents of local repositories to Azure](https://azure.microsoft.com/en-us/documentation/articles/web-sites-publish-source-control/). You already have the local repository; it was created in Exercise 3. Now it's just a matter of creating the Web App, providing a few key pieces of information such as application settings and deployment credentials, and executing a **git push** command.

1. tk.

1. tk.

1. tk.

1. tk.

1. tk.

1. tk.

1. tk.

1. tk.

1. tk.

1. tk.

If you make changes to the app and want to push the changes out to the Web, simply execute a **git push** again. Of course, you can still test your changes locally before publishing to the Web.

## Summary

In this hands-on lab, you learned how to:

- Create an Azure storage account and use it as a backing store for an app
- Write a Node.js app in Visual Studio Code and test it locally
- Use Git to deploy a Node.js app stored in a local repository to Azure
- Write code that uploads blobs to blob storage and attaches metadata to them
- Consume blob metadata to implement search
- Use Microsoft's Computer Vision API to generate metadata from images

There is much more that you could do to develop Intellipix and to leverage Azure even further. For example, you could add support for authenticating users and deleting photos, and rather than force the user to wait for Cognitive Services to process a photo following an upload, you could use [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) to call the Computer Vision API asynchronously each time an image is added to blob storage. You could even use Cognitive Services to detect faces in the photos and analyze the emotions depicted by those faces. With the cloud as your platform, the sky is the limit (pun intended).

----

Copyright 2016 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the Apache License, Version 2.0. You may use it according to the license as is most appropriate for your project on a case-by-case basis. The terms of this license can be found in http://www.apache.org/licenses/LICENSE-2.0.
