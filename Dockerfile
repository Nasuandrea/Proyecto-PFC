FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY . .
RUN ./mvnw package
CMD ["java", "-jar", "target/hrmanager-0.0.1-SNAPSHOT.jar"]