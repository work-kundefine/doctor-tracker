import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';

export const metadata: Metadata = {
  title: 'Doctor Tracker - Enterprise Clinical Intelligence',
  description: 'Enterprise Clinical Intelligence & Hospital Management Portal with real-time telemetry, doctor rosters, patient records, and performance analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var originalFetch = window.fetch;
                  var customFetch = originalFetch ? originalFetch.bind(window) : null;
                  Object.defineProperty(window, 'fetch', {
                    get: function () {
                      return customFetch || (originalFetch ? originalFetch.bind(window) : undefined);
                    },
                    set: function (fn) {
                      customFetch = fn;
                    },
                    configurable: true,
                    enumerable: true,
                  });
                } catch (e) {
                  try {
                    if (typeof Window !== 'undefined' && Window.prototype) {
                      var protoFetch = Window.prototype.fetch;
                      var customProtoFetch = protoFetch ? protoFetch.bind(window) : null;
                      Object.defineProperty(Window.prototype, 'fetch', {
                        get: function () {
                          return customProtoFetch || (protoFetch ? protoFetch.bind(window) : undefined);
                        },
                        set: function (fn) {
                          customProtoFetch = fn;
                        },
                        configurable: true,
                        enumerable: true,
                      });
                    }
                  } catch (err) {}
                }
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
