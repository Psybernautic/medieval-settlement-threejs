# SeedThree fruit models

`apple.glb` and `cherry_pair.glb` are copied from SkyeShark/SeedThree commit
`85787bf` under that project's MIT license. They live in the game repository
because the configured SeloSlav/SeedThree submodule does not publish them.

`raspberry_cluster.glb` is generated locally by running:

```sh
npm run generate:raspberry-fruit
```

The generated file is committed so a fresh checkout can build without an asset
generation step.
