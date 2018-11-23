#!/bin/bash

# Fail the build on any failed command
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
feature_id=`${DIR}/extractfeatureid`

s3_bucket=s3://$PROJECT_REPOSITORY_ID-$AWS_DEFAULT_REGION-${feature_id}-$ENV
echo "Creating bucket \"${s3_bucket}\" as needed"
aws s3 mb $s3_bucket 1> /dev/null

echo "Ensuring website settings for bucket \"${s3_bucket}\""
aws s3 website $s3_bucket --index-document index.html --error-document index.html

echo "Syncing build with \"${s3_bucket}\""

aws s3 sync --delete --acl public-read /$PROJECT_BASE_BUILD_PATH/$PROJECT_TO_DEPLOY_PATH $s3_bucket >> /build/sync.log

echo
dns_record_name=${feature_id}-$ENV.venzee.com
echo
echo "Verifying or creating DNS entry for ${dns_record_name} as needed"

dns_provider_url="https://api.cloudflare.com/client/v4/zones/${CF_ZONE}"

dns_records=`curl -s -X GET "${dns_provider_url}/dns_records?name=${dns_record_name}&page=1&per_page=1&match=all" \
  -H "X-Auth-Email: ${CF_AUTH_EMAIL}" \
  -H "X-Auth-Key: ${CF_AUTH_KEY}" \
  -H "Content-Type: application/json"`

sucess_regex="\"success\": *true"

if [[ $dns_records =~ $sucess_regex ]]; then

  has_no_records_regex="\"total_count\": *0"

  if [[ $dns_records =~ $has_no_records_regex ]]; then

    echo "Creating DNS entry for \"${dns_record_name}\""

    create_result=`curl -s -X POST "${dns_provider_url}/dns_records" \
      -H "X-Auth-Email: ${CF_AUTH_EMAIL}" \
      -H "X-Auth-Key: ${CF_AUTH_KEY}" \
      -H "Content-Type: application/json" \
      --data "{\"type\":\"CNAME\",\"name\":\"${dns_record_name}\",\"content\":\"$ENV-app.venzee.com\",\"ttl\":1, \"proxied\":true}"`

    if [[ $create_result =~ $sucess_regex ]]; then
      echo "Created DNS entry for \"${dns_record_name}\""
    else
        >&2 echo "
        Error creating dns record for \"${dns_record_name}\".
        Server responded with:
        ${create_result}
        "
        exit 1
    fi
  else
    echo "Verified that DNS entry for \"${dns_record_name}\" exists"
    echo "Purging cached CDN Data"
    ${DIR}/clearcdncache

  fi

else

  >&2 echo "
        Error trying to connecting to DNS Provider:
        ${dns_records}
        "
  exit 1

fi

echo
echo Done!
