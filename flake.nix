{
  description = "Zeithub - time tracking, invoicing & expenses (Express + Vue 3 + MySQL)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # Node 18 (matches .nvmrc / Dockerfile) was removed from unstable
    nixpkgs-node18.url = "github:NixOS/nixpkgs/nixpkgs-24.11-darwin";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, nixpkgs-node18, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        pkgsNode = import nixpkgs-node18 { inherit system; };

        # Puppeteer (invoice PDFs) needs a Chromium binary via CHROME_BIN.
        # nixpkgs has no Chromium on macOS, so fall back to the installed Chrome.
        chromeBin =
          if pkgs.stdenv.isLinux
          then "${pkgs.chromium}/bin/chromium"
          else "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

        buildInputs = with pkgs; [
          pkgsNode.nodejs_18

          # node-gyp toolchain for bcrypt
          python3
          pkg-config

          # MySQL/MariaDB client (db access, backups)
          mariadb.client

          # Docker CLI is expected from the host (docker-compose for the DB)
          git
          fish
        ] ++ lib.optionals stdenv.isLinux [ chromium ];

      in
      {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;

          CHROME_BIN = chromeBin;
          PUPPETEER_SKIP_DOWNLOAD = "1";

          shellHook = ''
            exec fish -C '
              # Node modules binaries
              set -gx PATH "$PWD/node_modules/.bin" $PATH

              # Set NIX_SHELL indicator for prompt customization
              set -gx IN_NIX_SHELL 1

              # Custom prompt with magenta color to indicate Nix environment
              function fish_prompt
                set_color magenta
                echo -n "[nix] "
                set_color blue
                echo -n (prompt_pwd)
                set_color green
                echo -n (fish_git_prompt)
                set_color normal
                echo -n " > "
              end

              echo "Zeithub development environment loaded"
              echo "Node: "(node --version)
              echo "CHROME_BIN: $CHROME_BIN"
            '
          '';

          LANG = "en_US.UTF-8";
          LC_ALL = "en_US.UTF-8";
        };
      });
}
