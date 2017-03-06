# jquery-fb-album-viewer

This is a jquery plugin that you can use to display your public facebook galleries inside your website.

### Sample usage

```html
<!-- Somewhere in the HTML -->
<div id="fb-album"></div>
```

```javascript
// Somewhere in the javascript 
$("#fb-album").FacebookAlbumViewer({
    account: 'Your Facebook Account Here',
    albumId: 'Your Facebook Album ID Here  ...',
    accessToken: 'Your Access Token Here ...'  
});
```
