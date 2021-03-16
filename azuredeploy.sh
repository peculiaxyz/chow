#! bin/bash
# Helper script to deploy the production optimised build of the react app to Azure

ResourceGroupName="chow-rg"
Location="westus"   # Staric webapps are only available in  west us currently
StorageAccountName="chowstorageaccount"
StorageSKU="Standard_LRS"
StorageKind="StorageV2"   # Allowed values: BlobStorage, BlockBlobStorage, FileStorage, Storage, StorageV2
StorageContainerName="chowsitecontainer01"
StorageContainerPublicAccessScope="container"  # Allowed values: blob, container, off
StorageAccessTier="Hot"
SiteName="chowstaticwebapp"
AppName="Chow Meals" 
BuildLocation="build/"  # "Directory where your production optimised build resides"
APIDir="api/"
GitHubRepoUrl="https://github.com/Banzyme/chow"

# Set the default location for all resources
az config set default.location=$Location

# First make sure we have a resource group
az group create -g $ResourceGroupName\
 --tags KeepRunning=False FullAppName="$AppName"  displayName="Chow Meals Resource Group" -o table


# Create the storage account
az storage account create\
  -n $StorageAccountName \
  -g $ResourceGroupName  \
  --sku $StorageSKU \
  --kind  $StorageKind \
  --access-tier $StorageAccessTier \
  --tags KeepRunning=False FullAppName="$AppName" displayName="Chow Meals Primary Storage Acount" --verbose -o yamlc


# Create a blob container to host the site - allow public access for all blobs within the container
az storage container create -n $StorageContainerName \ 
 --sas-token $SAS_TOKEN \
 --account-name $StorageAccountName \
 --public-access $StorageContainerPublicAccessScope



# Deploy static web app to Azure from Github
# NB: Not all regions are supported in current preview mode - 14 March 2021
az staticwebapp create \
    -n $SiteName \
    -g $ResourceGroupName \
    --location centralus \
    --source $GitHubRepoUrl \
    --branch master \
    --app-artifact-location $BuildLocation \
    --api-location $APIDir \
    --token $GITHUB_ACCESS_TOKEN \
    --tags KeepRunning=False FullAppName="$AppName" displayName="Chow Meals Static Web App" --verbose -o yamlc

