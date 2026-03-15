_: {
  perSystem =
    { pkgs, ... }:
    let
      pnpm = pkgs.pnpm_10;
      nodejs = pkgs.nodejs_24;
      src = ./..;

      pnpmDeps = pkgs.fetchPnpmDeps {
        pname = "pnpm-project-deps";
        version = "1.0.0";
        inherit src pnpm;
        fetcherVersion = 3;
        hash = "sha256-BVPVqa9ADPPnzVg9z4RGqQm5vaQzk3BaKdMnEIFUbyQ=";
      };

      mkCheck =
        {
          name,
          command,
          extraNativeBuildInputs ? [ ],
        }:
        pkgs.stdenvNoCC.mkDerivation {
          inherit name src pnpmDeps;

          nativeBuildInputs = [
            nodejs
            pkgs.pnpmConfigHook
            pnpm
          ]
          ++ extraNativeBuildInputs;

          dontBuild = true;

          doCheck = true;
          checkPhase = ''
            runHook preCheck
            ${command}
            runHook postCheck
          '';

          installPhase = ''
            runHook preInstall
            touch $out
            runHook postInstall
          '';
        };
    in
    {
      checks.tests = mkCheck {
        name = "tests";
        command = "pnpm test";
      };

      checks.lint = mkCheck {
        name = "lint";
        command = "oxlint --type-aware --type-check";
        extraNativeBuildInputs = [ pkgs.oxlint ];
      };
    };
}
