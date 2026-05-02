{
  description = "freak.wtf - Angel Batlles homepage dev shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_20
            # Asset optimization
            vips           # backing lib for sharp (sharp also has prebuilt binaries)
            libwebp        # cwebp
            libavif        # avifenc
          ];

          shellHook = ''
            export NODE_OPTIONS="--max-old-space-size=4096"
            echo "freak.wtf devshell — node $(node --version), npm $(npm --version)"
          '';
        };
      });
}
