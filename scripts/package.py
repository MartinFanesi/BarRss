"""Create a versioned extension ZIP, excluding tests and development artifacts."""
from pathlib import Path
import json
import zipfile

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'manifest.json').read_text())
output = root / f"barrss-extension-{manifest['version']}.zip"
files = [root / 'manifest.json', root / 'LICENSE', root / 'README.md', root / 'PRIVACY_POLICY.md']
for pattern in ('*.js', '*.html', '*.css'):
    files.extend(root.glob(pattern))
for directory in ('icons', 'vendor'):
    files.extend(p for p in (root / directory).rglob('*') if p.is_file())
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(set(files)):
        archive.write(file, file.relative_to(root))
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    names = set(archive.namelist())
    for file in ['background.js', 'shared.js', 'feed-parser.js', 'vendor/sax.js', 'reader-features.js', 'image-fallbacks.js']:
        assert file in names, file
print(f'{output.name}: {output.stat().st_size:,} bytes; {len(names)} archivos; ZIP verificado.')
