//Import dependencies
const fs = require('fs');
const { remote, ipcRenderer } = require('electron');
const Mousetrap = require('mousetrap');
const mainProcess = remote.require('./main.js');
const currentWindow = remote.getCurrentWindow();


//Cache required DOM elements
$backButton = $('#back-button');
$forwardButton = $('#forward-button');
$submitButton = $('#submit-button');
$reloadButton = $('#reload-button');
$openFileButton = $('.open-file-button');
const urlInput = document.getElementById('input-field');
$homeButton = $('#home-button');
$newWindowButton = $('#new-window-button');
$closeWinButton = $("#close-window-button");
$quitAppButton = $('#exit-button');
$printButton = $('#print-button');
$darkMode = $('#toggle-dark-mode');
$openDevTools = $('#open-dev-tools');
$findInPage = $('#find-in-page');
$startFind = $('#start-find-button');
$findNext = $('#find-next')
$findPrevious = $('#find-previous');

let currentSrc;
let currentContent;
var KEY;
//Shortcut bindings
Mousetrap.bind(['ctrl+shift+q', 'command+shift+q'], () => {
    mainProcess.quitApp();
})

Mousetrap.bind(['ctrl+q', 'command+q'], () => {
    mainProcess.closeWindow(currentWindow);
})

Mousetrap.bind(['ctrl+n', 'command+n'], () => {
    mainProcess.createWindow();
})

Mousetrap.bind(['ctrl+o', 'command+o'], () => {
    $currentWebView = $('.tab-content').find('div.active > webview');
    mainProcess.getFileFromUser(currentWindow);
})

Mousetrap.bind(['ctrl+d', 'command+d'], () => {
    openDevTools();
})

Mousetrap.bind(['ctrl+f', 'command+f'], () => {
    openFindPane();
})

Mousetrap.bind(['ctrl+p', 'command+p'], () => {
    printPage();
})


function filterURL(url){
    var pattern = /[.]+/;
    if(url.match(pattern) == null){
        search(url);
    }else{
        navigateToURL(url);
    }
}

function assignTabCloserAction() {
    $('.tab-closer').on('click', function (e) {
        let id = $(this).parent().attr('href');
        $(this).parent().parent().remove()
        $(`.tab-content > .tab-pane${id}`).remove()
    })
}

function openDevTools() {
    $currentWebView = $('.tab-content').find('div.active > webview');
    $currentWebView[0].openDevTools();
}

function printPage(){
    $currentWebView = $('.tab-content').find('div.active > webview');
    $currentWebView[0].print({ printBackground: true })
}

function openFindPane() {
    $findPane = $('#find-pane');
    $findPane.find('#close-find-pane').on('click', function (e) {
        $(this).parent().parent().hide();
        stopFindInPage();
        setInitContentHeight();
    })
    $findPane.show();
    setNewContentHeight();
}

function findInPage() {
    $currentWebView = $('.tab-content').find('div.active > webview');
    $currentWebView[0].findInPage(KEY, {});
}

function findNextOccurance() {
    $currentWebView[0].findInPage(KEY, {
        forward: true,
        findNext: true
    })
}

function findPreviousOccurance() {
    $currentWebView[0].findInPage(KEY, {
        forward: false,
        findNext: true
    })
}

function stopFindInPage() {
    $currentWebView[0].stopFindInPage("clearSelection");
}

$homeButton.on('click', () => {
    $currentWebView = $('.tab-content').find('div.active > webview');
    navigateToURL(PREFS.home_page);
    setBeforeLoadListener();
    setOnLoadListener()
});

$backButton.on('click', () => {
    $currentWebView = $('.tab-content').find('div.active > webview');
    $currentWebView[0].goBack();
    setBeforeLoadListener();
    setOnLoadListener()
});

$forwardButton.on('click', () => {
    $currentWebView = $('.tab-content').find('div.active > webview');
    $currentWebView[0].goForward();
    setBeforeLoadListener();
    setOnLoadListener()
});

$reloadButton.on('click', () => {
    $currentWebView = $('.tab-content').find('div.active > webview');
    $currentWebView[0].reload();
    setBeforeLoadListener();
    setOnLoadListener()
})

$submitButton.on('click', () => {
    $currentWebView = $('.tab-content').find('div.active > webview');
    filterURL(urlInput.value);
    setBeforeLoadListener();
    setOnLoadListener()
});

$openFileButton.on('click', () => {
    $currentWebView = $('.tab-content').find('div.active > webview');
    mainProcess.getFileFromUser(currentWindow);
})

$newWindowButton.on('click', () => {
    mainProcess.createWindow();
})

$openDevTools.on('click', () => {
    openDevTools();
})

$darkMode.on('click',()=>{
    mainProcess.DARK_MODE = !mainProcess.DARK_MODE;
})

$findInPage.on('click', () => {
    openFindPane();
})

$startFind.on('click', () => {
    KEY = $('#find-key').val();
    findInPage(KEY);
})

$findNext.on('click', () => {
    findNextOccurance();
})

$findPrevious.on('click', () => {
    findPreviousOccurance();
})

$printButton.on('click', () => {
    printPage();
})

$closeWinButton.on('click', () => {
    mainProcess.closeWindow(currentWindow);
})

$quitAppButton.on('click', () => {
    mainProcess.quitApp()
})

ipcRenderer.on('file-opened', (event, file, content) => {
    currentContent = content;
    $currentWebView.attr({ src: file });
    setBeforeLoadListener();
    setOnLoadListener()
    currentSrc = file;
})
