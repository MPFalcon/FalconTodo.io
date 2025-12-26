# Node.js 20 LTS base (Debian-based, stable)
FROM node:20-bookworm

# Avoid interactive apt prompts
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /www

# Install Java (required for Cassandra) + utilities
RUN apt-get update && apt-get install -y \
    default-jdk \
    curl \
    tar \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Add Cassandra binaries to PATH
ENV PATH="/opt/cassandra/bin:${PATH}"
# ENV MAX_HEAP_SIZE=512M
# ENV HEAP_NEWSIZE=128M

# Copy Node package files first (layer caching)
COPY www/package*.json ./

# Install Node dependencies
RUN npm ci --omit=dev

# Copy application source
COPY www/ .

# Add normal user for increased security and reduce undefined behavior for Cassandra
RUN useradd -s /bin/bash -d /www www
RUN chown -R www:www /www && chown -R www:www /opt && chown -R www:www /etc

USER www

# Install Apache Cassandra
ENV CASSANDRA_VERSION=5.0.6
RUN curl -fSL https://dlcdn.apache.org/cassandra/${CASSANDRA_VERSION}/apache-cassandra-${CASSANDRA_VERSION}-bin.tar.gz \
    | tar -xz -C /opt \
    && ln -s /opt/apache-cassandra-${CASSANDRA_VERSION} /opt/cassandra

# Cassandra data + logs
VOLUME ["/opt/cassandra/data"]

# Expose ports
# 3000 = Node app (change if needed)
# 9042, 7000, 7001 = Cassandra CQL
EXPOSE 3000 9042 7000 7001

# Start Cassandra + drop into bash
# Cassandra runs in foreground; bash stays interactive if -it is used
CMD ["/bin/bash", "-c", "cassandra -f & exec bash"]

# EOF
