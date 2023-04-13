# Generic mock responses for SAS

Login, sas stored process etc. made for [sasjs/server](https://github.com/sasjs/server)

## ENV Var configuration

When launching the app, it will make use of specific environment variables.

Example contents of a `.env` file:

```
# default: sas9
# options: [sas9|sasviya]
MOCK_SERVER_TYPE=sas9

# LOG_FORMAT_MORGAN options: [combined|common|dev|short|tiny] default: `common`
# Docs: https://www.npmjs.com/package/morgan#predefined-formats
LOG_FORMAT_MORGAN=

# This location is for server logs with classical UNIX logrotate behavior
LOG_LOCATION=./logs
```
