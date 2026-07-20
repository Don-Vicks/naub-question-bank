export async function downloadFile(url: string, suggestedFilename?: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = suggestedFilename ?? url.split('/').pop()?.split('?')[0] ?? 'paper-download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    // Fallback: open in new tab if CORS prevents blob fetch
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
