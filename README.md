# paclife-corp-ui

This is an AEM (Adobe Experience Manager) build for paclife-corp-ui.

## Modules

The main parts of the template are:

* core: Java bundle containing all core functionality like OSGi services, listeners or schedulers, as well as component-related Java code such as servlets or request filters.
* ui: contains the /apps (and /etc) parts of the project, ie JS&CSS clientlibs, components, templates, runmode specific configs as well as Hobbes-tests

## How to Build Local

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean package

## How to Build ADO
	
Checkin into ADO, runs sonarqube for the branch. Complete a pull request to Development to copy the changes to AMS development and run the build and install to AMS.

### UberJar

This project relies on the unobfuscated AEM 6.4 cq-quickstart. This is not publicly available from http://repo.adobe.com and must be 
manually 
downloaded from https://daycare.day.com/home/products/uberjar.html. After downloading the file (_cq-quickstart-6.4.0-apis.jar_), you must install it into your local Maven repository with this command:

    mvn install:install-file -Dfile=cq-quickstart-6.4.0-apis.jar -DgroupId=com.day.cq -DartifactId=cq-quickstart -Dversion=6.2.0 -Dclassifier=apis -Dpackaging=jar

## Testing

There are three levels of testing contained in the project:

* unit test in core: this show-cases classic unit testing of the code contained in the bundle. To test, execute:

    mvn clean test

* server-side integration tests: this allows to run unit-like tests in the AEM-environment, ie on the AEM server. To test, execute:

    mvn clean integration-test -PintegrationTests

* client-side Hobbes.js tests: JavaScript-based browser-side tests that verify browser-side behavior. To test:

    in the navigation, go the 'Operations' section and open the 'Testing' console; the left panel will allow you to run your tests.

## Maven Settings

The project comes with the auto-public repository configured. To setup the repository in your Maven settings, refer to:

    http://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html

