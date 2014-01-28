# SELENIUM_JAR="selenium-server-standalone-2.35.0.jar"
SELENIUM_JAR="selenium-server-standalone-2.39.0.jar"

if [ ! -f "bin/selenium/$SELENIUM_JAR" ]; then
  mkdir -p bin/selenium
  curl http://selenium.googlecode.com/files/$SELENIUM_JAR > bin/selenium/$SELENIUM_JAR
fi
