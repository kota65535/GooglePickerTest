

export class GooglePickerAPI {


    constructor(apiKey, accessToken, views, pickerCallback) {
        this.apiKey = apiKey;

        gapi.load('picker', () => {
            let view = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
            view.setMimeTypes('application/vnd.google-apps.folder');
            view.setSelectFolderEnabled(true);
        //
        //     var docsView = new google.picker.DocsView()
        //         .setIncludeFolders(true)
        //         .setSelectFolderEnabled(true);
        //
            this.pickerInstance = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.MINE_ONLY)
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                // .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                // .addView(docsView)
                .addView(view)
                // .addView(google.picker.ViewId.FOLDERS)
                // .addView(new google.picker.DocsView())
                // .addView(new google.picker.DocsUploadView().setIncludeFolders(true))
                .setOAuthToken(accessToken)
                .setDeveloperKey(apiKey)
                .setCallback(pickerCallback)
                .build();
        //
        });
    }

    showPicker() {
        this.pickerInstance.setVisible(true);
    }

    /**
     * Print files.
     */
    listFiles() {
        gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
        }).then(function (response) {
            appendPre('Files:');
            var files = response.result.files;
            if (files && files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    appendPre(file.name + ' (' + file.id + ')');
                }
            } else {
                appendPre('No files found.');
            }
        });
    }


    saveFile(file, done) {

        function addContent(fileId) {
            return gapi.client.request({
                path: '/upload/drive/v3/files/' + fileId,
                method: 'PATCH',
                params: {
                    uploadType: 'media'
                },
                body: file.content
            })
        }

        var metadata = {
            mimeType: 'application/vnd.google-apps.document',
            name: file.name,
            fields: 'id'
        }
        if (file.parents) {
            metadata.parents = file.parents;
        }

        if (file.id) { //just update
            addContent(file.id).then(function (resp) {
                console.log('File just updated', resp.result);
                done(resp.result);
            })
        } else { //create and update
            gapi.client.drive.files.create({
                resource: metadata
            }).then(function (resp) {
                addContent(resp.result.id).then(function (resp) {
                    console.log('created and added content', resp.result);
                    done(resp.result);
                })
            });
        }
    }
}

