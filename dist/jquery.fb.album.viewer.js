/*
 * https://github.com/research-and-develop/jquery-fb-album-viewer
 * Released under the MIT license
 */

(function ($) {
    $.fn.FacebookAlbumViewer = function (options) {

        var c = {
            STYLE_ID: 'fb-album-viewer-style',
            API_URL: 'https://graph.facebook.com/',
            FIELDS: ['id', 'created_time', 'from', 'height', 'icon', 'images', 'link', 'name', 'picture', 'updated_time', 'width', 'source'],
            TMPL_IMG:
                    '<div class="fav-col fav-xxs-12 fav-lg-3 fav-md-3 fav-sm-4 fav-xs-6">' +
                    '   <div class="image-wrapper" id="[@img-id@]">' +
                    '      <a target="_blank" href="[@img-href@]">' +
                    '         <img src="[@img-url@]" class="fb-album-viewer-img">' +
                    '      </a>' +
                    '      [@likes-box@]' +
                    '   </div>' +
                    '</div>',
            TMPL_LIKES_BOX:
                    '<table class="likes-box">' +
                    '   <tbody>' +
                    '      <tr>' +
                    '         <td valign="middle"><img src="https://embedsocial.com/image/like.png"></td>' +
                    '         <td valign="middle"><span class="likes"></span></td>' +
                    '      </tr>' +
                    '   </tbody>' +
                    '</table>',
            TAG_IMG_HREF: '[@img-href@]',
            TAG_IMG_ID: '[@img-id@]',
            TAG_IMG_URL: '[@img-url@]',
            TAG_LIKES: '[@likes-box@]'
        };

        var defaults = {
            account: "",
            accessToken: "",
            albumId: "",
            showLikes: false,
            debug: false,
            containerWidth: 820
        };

        var
                albumContainer = $(this),
                settings = $.extend({}, defaults, options);


        var style = '<style type="text/css" id="' + c.STYLE_ID + '">';
        style += '.fb-album-viewer-wrapper{margin-right: -15px; margin-left: -15px;}.fb-album-viewer-wrapper:before,.fb-album-viewer-wrapper:after{display: table;content: " ";}.fb-album-viewer-wrapper:after{clear: both;}';
        style += '.fav-col{position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;}';
        style += '.likes-box { background-color: rgba(0, 0, 0, 0.5); color: white; position: absolute; left: 5px; bottom: 10px; padding: 0px 5px; z-index: 2; font-size: 12px; display: block; border-radius: 3px;}';
        style += '.likes{color:white;}';
        style += '.fb-album-viewer-img{position: absolute; top: -9999px; left: -9999px; right: -9999px; bottom: -9999px; margin: auto;}';
        style += '.image-wrapper{position: relative; overflow: hidden; margin:5px auto;}.image-wrapper img{max-width: none;}';
        style += '.fav-xs-1,.fav-xs-2,.fav-xs-3,.fav-xs-4,.fav-xs-5,.fav-xs-6,.fav-xs-7,.fav-xs-8,.fav-xs-9,.fav-xs-10,.fav-xs-11,.fav-xs-12{float: left;}.fav-xs-12{width: 100%;}.fav-xs-11 {width: 91.66666667%;}.fav-xs-10 {width: 83.33333333%;}.fav-xs-9 {width: 75%;}.fav-xs-8 {width: 66.66666667%;}.fav-xs-7 {width: 58.33333333%;}.fav-xs-6 {width: 50%;}.fav-xs-5 {width: 41.66666667%;}.fav-xs-4 {width: 33.33333333%;}.fav-xs-3 {width: 25%;}.fav-xs-2 {width: 16.66666667%;}.fav-xs-1 {width: 8.33333333%;}';
        style += ' @media (min-width: 550px) { .image-wrapper{width: 260px; height: 260px;} .likes-box { bottom: 20px;} }';
        style += ' @media (min-width: 600px) { .image-wrapper{width: 280px; height: 280px;} .likes-box { bottom: 30px;} }';
        style += ' @media (min-width: 640px) { .image-wrapper{width: 330px; height: 330px;} .likes-box { bottom: 40px;} }';
        style += ' @media (min-width: 768px) { .image-wrapper{width: 260px; height: 200px;} .likes-box { bottom: 50px;}.fav-sm-1, .fav-sm-2, .fav-sm-3, .fav-sm-4, .fav-sm-5, .fav-sm-6, .fav-sm-7, .fav-sm-8, .fav-sm-9, .fav-sm-10, .fav-sm-11, .fav-sm-12 {float: left;}.fav-sm-12 {width: 100%;}.fav-sm-11 {width: 91.66666667%;}.fav-sm-10{width: 83.33333333%;} .fav-sm-9 {width: 75%;}.fav-sm-8{width: 66.66666667%;}.fav-sm-7{width: 58.33333333%;}.fav-sm-6{width: 50%;}.fav-sm-5{width: 41.66666667%;}.fav-sm-4{width: 33.33333333%;}.fav-sm-3{width: 25%;}.fav-sm-2{width: 16.66666667%;}.fav-sm-1{width: 8.33333333%;}}';
        style += ' @media (min-width: 1200px) {.image-wrapper{width: 200px; height: 200px;}.fav-lg-1, .fav-lg-2, .fav-lg-3, .fav-lg-4, .fav-lg-5, .fav-lg-6, .fav-lg-7, .fav-lg-8, .fav-lg-9, .fav-lg-10, .fav-lg-11, .fav-lg-12 {float: left;}.fav-lg-12 {width: 100%;}.fav-lg-11 {width: 91.66666667%;}.fav-lg-10{width: 83.33333333%;}.fav-lg-9 {width: 75%;}.fav-lg-8{width: 66.66666667%;}.fav-lg-7{width: 58.33333333%;}.fav-lg-6{width: 50%;}.fav-lg-5{width: 41.66666667%;}.fav-lg-4{width: 33.33333333%;}.fav-lg-3{width: 25%;}.fav-lg-2{width: 16.66666667%;}.fav-lg-1{width: 8.33333333%;}}';
        style += ' @media (max-width: 549px) { .image-wrapper{width: 320px; height: 320px;} .likes-box { bottom: 55px;} .fav-xxs-12{width: 100%;} }';
        style += '</style>';

        /**
         * This function is checking if there is a <style> tag with id = c.STYLE_ID
         * and if there isn't is adding new <style> tag containing necessary styles
         * @returns {void}
         */
        var applyStyle = function _applyStyle() {

            var styleExists = false;

            /* check each <head> node if it is the style of this plugin */
            $('head').children().each(function (index, element) {
                if (element.tagName == 'STYLE' && element.id == c.STYLE_ID) {
                    styleExists = true;
                    return false;
                }
            });

            if (!styleExists) {
                /* if there isn't plugin's style add it to head */
                $(style).appendTo('head');
            }
        };

        /**
         * This function is making HTTP GET request to facebook's grapth API
         * to retrive images by specified albumId. On success generatePhotos 
         * method is called to generate the HTML of the album's images
         * @returns {void}
         */
        var requestAlbumPhotos = function _requestAlbumPhotos() {

            /* cannot proceed if there is no albumId specified */
            if (!settings.accessToken.length) {
                console.error("accessToken is missing cannot proceed ...");
                return;
            }

            /* cannot proceed if there is no albumId specified */
            if (!settings.albumId.length) {
                console.error("albumId is missing cannot proceed ...");
                return;
            }

            var url = c.API_URL + settings.albumId + '/' + 'photos?access_token=' + settings.accessToken + '&fields=' + c.FIELDS.join(',');

            /* make HTTP request */
            get(url).then(function (data, textStatus, jqXHR) {
                /* success */
                debugLog('success ...');
                debugLog(data);

                if (typeof data.data !== 'undefined') {
                    generatePhotos(data.data);
                }

            }, function (jqXHR, textStatus, errorThrown) {
                /* failed */
                debugLog('failed ...');
                debugLog(errorThrown);
            });
        };

        /**
         * This function is generating the HTML content of album 
         * from result of graph API call
         * @param {array} photosData - array of data describing images in fb album
         * @returns {void}
         */
        var generatePhotos = function _generatePhotos(photosData) {

            var photosHtml = '';
            for (var i = 0; i < photosData.length; i++) {

                var current = photosData[i];

                photosHtml += c.TMPL_IMG
                        .replace(c.TAG_IMG_HREF, current.link)
                        .replace(c.TAG_IMG_ID, current.id)
                        .replace(c.TAG_IMG_URL, current.images[current.images.length - 1].source)
                        .replace(c.TAG_LIKES, settings.showLikes ? c.TMPL_LIKES_BOX : '');

            }

            albumContainer.html('<div class="fb-album-viewer-wrapper">' + photosHtml + '</div>');

            if (settings.showLikes) {
                /* update likes */
                for (var i = 0; i < photosData.length; i++) {
                    var current = photosData[i];

                    (function (photoId) {
                        get(c.API_URL + photoId + '/likes?access_token=' + settings.accessToken).then(function (data, textStatus, jqXHR) {

                            $('#' + photoId).find('.likes')[0].innerHTML = data.data.length;

                        }, function (jqXHR, textStatus, errorThrown) {
                            /* error */
                            console.log(errorThrown);
                        });
                    })(current.id);
                }
            }
        };

        var debugLog = function _log(message) {
            if (settings.debug) {
                console.log(message);
            }
        };

        var get = function _get(url) {
            return $.ajax({method: 'GET', url: url, cache: false});
        };

        applyStyle();
        requestAlbumPhotos();

        // apply container style
        albumContainer.css({
            'max-width': settings.containerWidth,
            'margin': '0px auto'
        });

        return albumContainer;
    };
})(jQuery);