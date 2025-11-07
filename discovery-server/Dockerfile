# Use an OpenJDK 17 runtime image
FROM eclipse-temurin:17-jdk-jammy
# Expose Eureka Server port
EXPOSE 8761
# Add the service's JAR (built by Maven) into the container
COPY target/discovery-server-0.0.1-SNAPSHOT.jar /app/discovery-server.jar
# Run the Eureka server
ENTRYPOINT ["java","-jar","/app/discovery-server.jar"]
