---
sidebar_position: 1
title: Update or kill squid
---

# Update or kill a squid

The number of squid version is limited by three so 
we recommend updating an existing version instead of 
launching a new one.

## Update a squid version

An existing squid version can be updated with a `sqd squid update` which is similar to `squid release`. Use 

```bash
npx sqd squid update my-new-squid@v0 -v
```
or

```bash
npx sqd squid update my-new-squid@v0 -v --source <repo.git>#<commit>
```

to update the version. By default, `sqd squid update` only updates the squid images and does not drop the database (but applies the new migrations from the `db/migrations` folder). Thus, the squid sync will continue from its last state. To force the database wipeout and start the squid sync from scratch, add `--hardReset` flag:

```bash
npx sqd squid update my-new-squid@v0 -v --source <repo.git>#<commit> --hardReset
```

Note that the total number of deployed squid versions is limited to three, so we strongly recommend updating existing squid versions rather than creating new ones. 

## Kill an unused version

Unused versions can be killed with 
`npx sqd squid kill <name>@<version>`.