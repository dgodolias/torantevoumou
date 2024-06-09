# Use the .NET 7 SDK image
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview-jammy AS build-env

# Set the working directory
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Start new stage for .NET runtime
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview-jammy

WORKDIR /app

# Install Node.js
RUN apt-get update && \
    apt-get install -y wget && \
    wget -qO- https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y build-essential nodejs

# Copy everything from the build-env stage
COPY --from=build-env /app/out .

# Copy firebaseprov.js and package.json from the build stage
COPY --from=build-env /app/firebaseprov.js .
COPY --from=build-env /app/package*.json ./

# Install npm packages
RUN npm install

# Run your .NET application
CMD ASPNETCORE_URLS=http://*:$PORT dotnet torantevoumou.dll