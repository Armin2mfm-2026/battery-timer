import { readFileSync, writeFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
if (!match) throw new Error(`Native releases require a stable x.y.z app version; received "${version}".`);

const [, majorText, minorText, patchText] = match;
const [major, minor, patch] = [majorText, minorText, patchText].map(Number);
if (major > 2099 || minor > 999 || patch > 999) {
  throw new Error(`App version "${version}" cannot be represented as a supported Android version code.`);
}

const androidVersionCode = major * 1_000_000 + minor * 1_000 + patch;
const androidGradlePath = new URL('../android/app/build.gradle', import.meta.url);
const androidGradle = readFileSync(androidGradlePath, 'utf8');
if (!/versionCode\s+\d+/.test(androidGradle) || !/versionName\s+"[^"]+"/.test(androidGradle)) {
  throw new Error('Could not find Android versionCode/versionName in android/app/build.gradle.');
}
writeFileSync(
  androidGradlePath,
  androidGradle
    .replace(/versionCode\s+\d+/, `versionCode ${androidVersionCode}`)
    .replace(/versionName\s+"[^"]+"/, `versionName "${version}"`)
);

const iosProjectPath = new URL('../ios/App/App.xcodeproj/project.pbxproj', import.meta.url);
const iosProject = readFileSync(iosProjectPath, 'utf8');
if (!/CURRENT_PROJECT_VERSION = \d+;/.test(iosProject) || !/MARKETING_VERSION = [^;]+;/.test(iosProject)) {
  throw new Error('Could not find iOS version settings in ios/App/App.xcodeproj/project.pbxproj.');
}
writeFileSync(
  iosProjectPath,
  iosProject
    .replace(/CURRENT_PROJECT_VERSION = \d+;/g, `CURRENT_PROJECT_VERSION = ${androidVersionCode};`)
    .replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${version};`)
);

console.log(`Synchronized native app version ${version} (build ${androidVersionCode}).`);
