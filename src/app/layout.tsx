import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.css";
import { ModalsProvider } from "@mantine/modals";
import "mantine-datatable/styles.layer.css";
import "./layout.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
