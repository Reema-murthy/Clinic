FROM eclipse-temurin:17-jdk-jammy

EXPOSE 8084

COPY target/gen-ai-service-0.0.1-SNAPSHOT.jar /app/gen-ai-service.jar

ENTRYPOINT ["java","-jar","/app/gen-ai-service.jar"]

