'use client';

import { useState } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function PreviewModal({ task }) {
  const [open, setOpen] = useState(false);
  const file_name = task.media.substring(task.media.lastIndexOf('/') + 1);

  return (
    <>
        <DocViewer
            documents={[{ uri: task.media }]}
            pluginRenderers={DocViewerRenderers}
            // style={{ height: 100 }}
            config={{
                header: {
                    disableHeader: false,
                    disableFileName: false,
                    retainURLParams: false,
                },
                csvDelimiter: ",", // "," as default,
                pdfZoom: {
                    defaultZoom: 1.1, // 1 as default,
                    zoomJump: 0.1, // 0.1 as default,
                },
                pdfVerticalScrollByDefault: true, // false as default
            }}
            className='h-300'
        />
    </>
  );
}