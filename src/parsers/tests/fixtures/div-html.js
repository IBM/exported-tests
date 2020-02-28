/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const divHTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>Div: Variant One: Preview Layout</title>
    </head>
    <body>
    <main role="main" id="main-content" style="min-height: 100vh">
        <div class="bx--meow bx--meow--variant-one">
        <span>Meow unique text</span>
        <p>Cat's meow</p>
        <p class="fails-conditions">Dog's bark</p>
        <p>Bird's tweet</p>
        <input id="my-input" type="checkbox" checked />
        </div>
    </main>
    </body>
    </html>`;

export default divHTML;
