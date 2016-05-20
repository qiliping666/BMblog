import markdownpdf from 'markdown-pdf';

markdownpdf({
    paperFormat : 'A4'
}).from("app/doc/document.md").to("app/doc/document.pdf", function () {
    console.log("Done")
});