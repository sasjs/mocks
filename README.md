# Generic mock responses for SAS

Login, sas stored process etc. made for [sasjs/server](https://github.com/sasjs/server)

## ENV Var configuration

When launching the app, it will make use of specific environment variables.

Example contents of a `.env` file:

```
# default: sas9
# options: [sas9|sasviya]
MOCK_SERVER_TYPE=sas9

# Path to working directory
# This location is for SAS WORK, staged files, DRIVE, configuration etc
SASJS_ROOT=./sasjs_root

# This location is for files
DRIVE_LOCATION=./sasjs_root/drive

# LOG_FORMAT_MORGAN options: [combined|common|dev|short|tiny] default: `common`
# Docs: https://www.npmjs.com/package/morgan#predefined-formats
LOG_FORMAT_MORGAN=

# This location is for server logs with classical UNIX logrotate behavior
LOG_LOCATION=./logs
```
