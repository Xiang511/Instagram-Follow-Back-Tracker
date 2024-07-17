# Instagram-Follow-Back-Tracker
![GitHub last commit](https://img.shields.io/github/last-commit/Xiang511/Instagram-Follow-Back-Tracker?display_timestamp=committer&style=flat-square) ![GitHub commit activity](https://img.shields.io/github/commit-activity/y/Xiang511/Instagram-Follow-Back-Tracker?style=flat-square) ![GitHub Created At](https://img.shields.io/github/created-at/Xiang511/Instagram-Follow-Back-Tracker?style=flat-square) ![GitHub License](https://img.shields.io/github/license/Xiang511/Instagram-Follow-Back-Tracker?style=flat-square)

This method utilizes Instagram's "Download Your Data" feature to retrieve a list of your followers and following. By comparing the two lists, you can identify those who no longer follow you back.


## Features

- [x] See who's not following me back on Instagram
- [ ] Add a timeline to show how long a user has been following someone
- [ ] Optimize website interface

## Usage

### Preparation

Navigate to the Account Management Center and Locate Your Information and Privacy Page

Click "Download information", select the "JSON" format.

```
https://accountscenter.instagram.com/info_and_permissions/
```

### Process Downloaded Data

Once you receive the download completion email, click the link to download the ZIP file.

Extract the ZIP file and locate the ```followers.json``` and ```following.json``` files.

After the above steps are ready, you can go to the website and upload your JSON file.


## Data Privacy Policy

This website does not retain any relevant information, it only offers search capabilities.


## License

This project is published under GPL-3.0 License.
