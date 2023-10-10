

import { HTMLFunctionEvent } from "../../src";


export async function html(e: HTMLFunctionEvent): Promise<string> {

  return String(
    <html>
      <head>
        {e.scripts.map(script => 
          <script src={script} defer/>
        )}
        {e.styles.map(style => 
          <link href={style} rel="stylesheet"/>
        )}
      </head>
      <body>
        {e.body}
      </body>
    </html>
  )
}