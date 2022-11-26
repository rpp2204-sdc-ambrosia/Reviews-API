#!/bin/bash

if [ "$NODE_ENV" == "production" ] ; then
  npm run start
else
  npm run server-dev
fi