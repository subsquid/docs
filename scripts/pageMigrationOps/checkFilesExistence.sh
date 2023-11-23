#!/bin/bash

# Usage: checkFileExistence.sh <path_to_log> <log_column>
# E.g. to check if all sorce files in correspondences.log exist, use
#   $ checkFileExistence.sh correspondences.log 1
# To check if destination files exist, use
#   $ checkFileExistence.sh correspondences.log 3

IFS=$'\n'
for ppath in `cut -d ' ' -f $2 $1`; do
	path="docs/$ppath"
	if [[ "$path" =~ .*"md"|"mdx"$ ]]; then
		if [ ! -f "$path" ]; then
			echo File $path not found or is not a regular file
		fi
	else
		if [ ! -d "$path" ]; then
			echo Directory $path not found or is not a directory
		fi
	fi
done
