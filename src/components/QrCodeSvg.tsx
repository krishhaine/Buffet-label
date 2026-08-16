import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeSvgProps {
  url: string;
  size?: number;
  color?: string;
  className?: string;
}

export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({
  url,
  size = 48,
  color = '#000000',
  className = '',
}) => {
  const [svgString, setSvgString] = useState<string>('');

  useEffect(() => {
    if (!url) {
      setSvgString('');
      return;
    }

    QRCode.toString(
      url,
      {
        type: 'svg',
        width: size,
        margin: 0,
        color: {
          dark: color,
          light: '#00000000', // transparent
        },
      },
      (err, string) => {
        if (!err && string) {
          setSvgString(string);
        }
      }
    );
  }, [url, size, color]);

  if (!svgString) return null;

  return (
    <div
      className={`inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};
