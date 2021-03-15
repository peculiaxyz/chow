#! bin/bash
# Helper script to deploy the production optimised build of the react app to Azure

ResourceGroupName="chow-rg"
Location="southafricanorth"
StorageAccountName="chowstorageaccount"
StorageSKU="Standard_LRS"
StorageKind="StorageV2"   # Allowed values: BlobStorage, BlockBlobStorage, FileStorage, Storage, StorageV2
StorageContainerName="chowsitecontainer01"
StorageContainerPublicAccessScope="container"  # Allowed values: blob, container, off
StorageAccessTier="Hot"
SiteName="chow"
AppName="Chow Meals" 

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

