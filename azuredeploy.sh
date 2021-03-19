#! bin/bash
# Helper script to deploy the production optimised build of the react app to Azure

ResourceGroupName="chow-rg"
Location="WestUs2"   # Staric webapps are only available in  west us currently
SiteName="chowstaticwebapp"
AppName="Chow Meals" 
BuildLocation="build"  # "Directory where your production optimised build resides"
AppDir="."
APIDir="api"
GitHubRepoUrl="https://github.com/peculiaxyz/chow"
GitHubRepoBranch="main"
GithubPAT=""


# First make sure we have a resource group
# Sometimes it fails if it already exist(Sometimes it doesn't..)
az group create -g $ResourceGroupName\
 -l $Location\
 --tags KeepRunning=False FullAppName="$AppName"  displayName="Chow Meals Resource Group" -o table


az staticwebapp create -n $SiteName\
 -g $ResourceGroupName \
 -l $Location \
 -b $GitHubRepoBranch \
 --app-location $APIDir\
 --app-artifact-location $BuildLocation \
 --api-location $APIDir \
 -s "$GitHubRepoUrl" \
 --token "$GithubPAT" \
 -o yamlc

