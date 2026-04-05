@ECHO OFF
SETLOCAL

SET "APP_HOME=%~dp0"
IF "%APP_HOME:~-1%"=="\" SET "APP_HOME=%APP_HOME:~0,-1%"

IF NOT DEFINED JAVA_HOME (
  ECHO JAVA_HOME is not set. Install JDK 17+ and set JAVA_HOME. 1>&2
  EXIT /B 1
)

SET "WRAPPER_JAR=%APP_HOME%\.mvn\wrapper\maven-wrapper.jar"
IF NOT EXIST "%WRAPPER_JAR%" (
  ECHO Missing %WRAPPER_JAR% 1>&2
  EXIT /B 1
)

"%JAVA_HOME%\bin\java.exe" ^
  %MAVEN_OPTS% ^
  -classpath "%WRAPPER_JAR%" ^
  "-Dmaven.multiModuleProjectDirectory=%APP_HOME%" ^
  org.apache.maven.wrapper.MavenWrapperMain %*

ENDLOCAL
