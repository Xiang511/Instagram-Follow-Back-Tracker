# Instagram-Follow-Back-Tracker
![GitHub last commit](https://img.shields.io/github/last-commit/Xiang511/Instagram-Follow-Back-Tracker?display_timestamp=committer&style=flat-square) ![GitHub commit activity](https://img.shields.io/github/commit-activity/y/Xiang511/Instagram-Follow-Back-Tracker?style=flat-square) ![GitHub Created At](https://img.shields.io/github/created-at/Xiang511/Instagram-Follow-Back-Tracker?style=flat-square) ![GitHub License](https://img.shields.io/github/license/Xiang511/Instagram-Follow-Back-Tracker?style=flat-square) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Xiang511/Instagram-Follow-Back-Tracker/ci.yml?style=flat-square&logo=github&label=CI&branch=refactor/nuxt)


This method utilizes Instagram's "Download Your Data" feature to retrieve a list of your followers and following. By comparing the two lists, you can identify those who no longer follow you back.This tool only requires a JSON file and does not require any authorization or authentication. 


## Features

- [x] See who's not following me back on Instagram, with a timeline of how long you have followed them
- [x] Upload the two JSON files, or the whole Instagram ZIP (when Instagram splits the followers file into `followers_1`, `followers_2`..., they are merged automatically)
- [x] Download results as JSON or CSV
- [x] Ignore list and tags, with export / import (imports are merged and never overwrite existing data)
- [x] Watchlist for people you want to keep an eye on, with export / import
- [x] Multiple themes (daisyUI)
- [ ] See who's not following me back on Threads (in progress)


## Usage

### Preparation

Navigate to the Account Management Center and Locate Your [Information and Privacy Page](https://accountscenter.instagram.com/info_and_permissions/)

```Instagram```

Click "Download information" > partail Information > Followers and followers list (only) > data range : all the time > Format select json

```Threads```

Click "Download information" > partail Information > Threads (only) > data range : all the time > Format select json

```
Demo: https://www.youtube.com/watch?v=0XyRyZL3BO4&ab_channel=XiangFang
```

### Process Downloaded Data

Once you receive the download completion email, click the link to download the ZIP file.

Extract the ZIP file and locate the ```followers.json``` and ```following.json``` files.

After the above steps are ready, go to the website and upload either the two JSON files or the ZIP file directly.

If you have more than about 1000 followers, Instagram splits the followers file into several parts. Upload the ZIP and they are merged for you.

The ignore list, tags and watchlist are stored in your browser (localStorage). Clearing site data removes them, so export a backup first.



## Data Privacy Policy

This website does not retain any relevant information, it only offers search capabilities.


## License

This project is published under GPL-3.0 License.
