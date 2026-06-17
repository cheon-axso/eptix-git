const ORG = "axso-ev";
const PREFIX = "eptix-";
const DEST = "/Users/charlesheon/Web/eptix";

async function main() {
  console.log(`Fetching repos for org: ${ORG}`);

  const proc = Bun.spawn(
    ["gh", "repo", "list", ORG, "--limit", "1000", "--json", "name,sshUrl"],
    { stdout: "pipe", stderr: "pipe" }
  );

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  await proc.exited;

  if (proc.exitCode !== 0) {
    console.error("Failed to list repos:", stderr);
    process.exit(1);
  }

  const all: { name: string; sshUrl: string }[] = JSON.parse(stdout);
  const targets = all.filter((r) => r.name.startsWith(PREFIX));

  console.log(`Found ${targets.length} repos with prefix "${PREFIX}":`);
  targets.forEach((r) => console.log(`  ${r.name}`));

  await Bun.$`mkdir -p ${DEST}`;

  for (const repo of targets) {
    const dest = `${DEST}/${repo.name}`;
    const alreadyCloned = await Bun.file(`${dest}/.git/HEAD`).exists();

    if (alreadyCloned) {
      console.log(`\n[skip] ${repo.name} — already exists`);
      continue;
    }

    console.log(`\n[clone] ${repo.name}`);
    const clone = Bun.spawn(["git", "clone", repo.sshUrl, dest], {
      stdout: "inherit",
      stderr: "inherit",
    });
    await clone.exited;

    if (clone.exitCode !== 0) {
      console.error(`  ✗ failed`);
    } else {
      console.log(`  ✓ done`);
    }
  }

  console.log("\nDone.");
}

main();
