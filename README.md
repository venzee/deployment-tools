# @venzee/deployment-tools

A library of deployment tools to address some of Venzee's deployment
challenges.

## Scripts

### createCustomConfig

The purpose of this script is to create a custom configuration based on
environment variables. The expected variables are described below.

#### `VENZEE_CUSTOM_BUILD_TARGET` variable

**Required** - The name of the target to build.

Venzee-specific standard targets - those that should no be defined as custom build targets - may include:

- `dev`
- `local`
- `prod`
- `qa`
- `rsqa`
- `sandbox`

An example for a custom build target may be `Feature_TM1-1234` or`
Bug_TM1-1234`. Our build scripts might use that name to create sub domains,
name S3 containers, etc.

#### `VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH` variable

**Required** - Path to the configuration file based on which to create the
custom configuration. The file is expected to point to a JSON file.

On the build server, here is what will happen:

1. The build script will load in the file located at the path at `VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH`
1. It will then apply changes defined in the environment with the prefix `VENZEE_CUSTOM_BUILD_PARAMETER_` to the configuration retrieved from that file, overriding those parameters.
1. It will then overwrite the file at `VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH` with the modified values

#### `VENZEE_CUSTOM_BUILD_PARAMETER_` prefix

**Optional** - Prefix to use to define parameter overrides or additions.

Environmental variables with the `VENZEE_CUSTOM_BUILD_PARAMETER_` prefix
will be added to or overridden in the existing configuration at
`VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH`

For example, `VENZEE_CUSTOM_BUILD_PARAMETER_SEGMENTIO_ID='A1234'` will set
the configuration value of `SEGMENTIO_ID` to `A1234`.

:warning: Note that currently **only simple types** (strings,
numbers, booleans) **are supported**, complex objects and arrays are not.
