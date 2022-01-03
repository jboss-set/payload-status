import React from 'react';

import { Link } from '../common/Util';
import { TableComposable, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

const buildProjects = [
  "A-MQ-artemis-wildfly-integration",
  "Azure-azure-storage-java",
  "FasterXML-jackson-annotations",
  "FasterXML-jackson-bom",
  "FasterXML-jackson-core",
  "FasterXML-jackson-databind",
  "FasterXML-jackson-dataformat-xml",
  "FasterXML-jackson-dataformats-binary",
  "FasterXML-jackson-dataformats-text",
  "FasterXML-jackson-jaxrs-providers",
  "FasterXML-jackson-modules-base",
  "FasterXML-jackson-modules-java8",
  "FasterXML-jackson-parent",
  "FasterXML-oss-parent",
  "FasterXML-stax2-api",
  "FasterXML-woodstox",
  "IBM-java-async-util",
  "JCTools-JCTools",
  "JGroups",
  "JGroups - 4.0.x",
  "JGroups - 4.1.x",
  "ReactiveX-RxJava",
  "ReactiveX-RxJava - 2.2.x",
  "aesh",
  "aeshell-aesh-extensions",
  "aeshell-aesh-extensions - 1.6.x",
  "aeshell-aesh-readline",
  "aeshell-aesh-readline - 1.x",
  "agroal-agroal",
  "antlr2",
  "apache-commons-beanutils",
  "apache-commons-cli",
  "apache-commons-codec",
  "apache-commons-collections",
  "apache-commons-io",
  "apache-commons-lang - 2.x",
  "apache-commons-lang - 3.x",
  "apache-commons-parent",
  "apache-cxf",
  "apache-cxf - 3.2.x",
  "apache-cxf - 3.3.x",
  "apache-httpasyncclient",
  "apache-httpclient",
  "apache-httpcomponents",
  "apache-httpcomponents-parent",
  "apache-httpcore",
  "apache-james-mime4j",
  "apache-james-project",
  "apache-kafka",
  "apache-logging-log4j2",
  "apache-logging-parent",
  "apache-lucene-solr",
  "apache-maven-pom",
  "apache-mina-sshd",
  "apache-santuario-java",
  "apache-santuario-xml-security-java",
  "apache-santuario-xml-security-java - 2.1.x",
  "apache-taglibs-parent",
  "apache-taglibs-standard",
  "apache-thrift",
  "apache-velocity",
  "apache-velocity-maven",
  "apache-webservices-neethi",
  "apache-webservices-xmlschema",
  "apache-wss4j",
  "apache-wss4j - 2.2.x",
  "apache-xjc-utils",
  "asf-maven-pom",
  "asm",
  "atinject",
  "avro",
  "b_c-jose4j",
  "bcgit-bc-java",
  "bcgit-bc-java - 1.60.x",
  "beanvalidation-api",
  "ben-manes-caffeine",
  "cal10n",
  "cdi-spec-cdi",
  "codehaus-jackson",
  "codehaus-jaxen",
  "codehaus-jettison",
  "dom4j - 1.x",
  "dom4j - 2.x",
  "eap-installer",
  "eclipse-ee4j-beanvalidation-api",
  "eclipse-ee4j-cdi",
  "eclipse-ee4j-concurrency-ri",
  "eclipse-ee4j-el-ri",
  "eclipse-ee4j-injection-api",
  "eclipse-ee4j-jaf",
  "eclipse-ee4j-jaxb-dtd-parser",
  "eclipse-ee4j-jaxb-fi",
  "eclipse-ee4j-jaxb-istack-commons",
  "eclipse-ee4j-jaxb-ri",
  "eclipse-ee4j-jaxb-stax-ex",
  "eclipse-ee4j-jpa-api",
  "eclipse-ee4j-jsonb-api",
  "eclipse-ee4j-jsonp",
  "eclipse-ee4j-mail",
  "eclipse-ee4j-mojarra",
  "eclipse-ee4j-security-api",
  "eclipse-ee4j-soteria",
  "eclipse-ee4j-yasson",
  "eclipse-jdt-eclipse.jdt.core",
  "eclipse-jgit",
  "eclipse-microprofile-config",
  "eclipse-microprofile-fault-tolerance",
  "eclipse-microprofile-health",
  "eclipse-microprofile-jwt-auth",
  "eclipse-microprofile-metrics",
  "eclipse-microprofile-open-api",
  "eclipse-microprofile-opentracing",
  "eclipse-microprofile-reactive-messaging",
  "eclipse-microprofile-reactive-streams-operators",
  "eclipse-microprofile-rest-client",
  "eclipse-vert.x",
  "fge-btf",
  "fge-jackson-coreutils",
  "fge-msg-simple",
  "fusesource-hawtjni",
  "fusesource-mvnplugins",
  "gf-metro-jaxb",
  "glassfish-concurrent",
  "glassfish-fastinfoset",
  "glassfish-jaf",
  "glassfish-json",
  "google-gson",
  "googleapis-java-common-protos",
  "googleapis-java-shared-config",
  "guava-failureaccess",
  "guava-libraries",
  "h2database",
  "hal-console",
  "hal-console - 3.0.x",
  "hal-console - 3.2.x",
  "hibernate-hibernate-commons-annotations",
  "hibernate-hibernate-core",
  "hibernate-hibernate-search",
  "hibernate-hibernate-validator",
  "hornetq-hornetq",
  "infinispan-infinispan",
  "infinispan-infinispan - 11.0.x",
  "infinispan-infinispan - 9.4.x",
  "infinispan-protostream",
  "installer-commons",
  "ironjacamar",
  "istack-commons",
  "izpack",
  "jaegertracing-jaeger-client-java",
  "jandex",
  "jansi",
  "jasypt",
  "java-classmate",
  "java-getopt",
  "javaee-jaxb-dtd-parser",
  "javaee-jaxb-istack-commons",
  "javaee-jpa-spec",
  "javaee-jsonb-spec",
  "javaee-metro-stax-ex",
  "javaee-security-api",
  "javaee-security-soteria",
  "jberet-jsr352",
  "jboss-eap-xp - 2.0.x",
  "jboss-eap-xp - 3.0.x",
  "jboss-glassfish-javamail",
  "jboss-javassist-javassist",
  "jboss-jboss-annotations-api_1.3_spec",
  "jboss-jboss-batch-api_spec",
  "jboss-jboss-common-beans",
  "jboss-jboss-connector-api_spec",
  "jboss-jboss-ejb-api_spec",
  "jboss-jboss-el-api_spec",
  "jboss-jboss-interceptors-api_spec",
  "jboss-jboss-j2eemgmt-api_spec",
  "jboss-jboss-jacc-api_spec",
  "jboss-jboss-jakarta-annotations-api_spec",
  "jboss-jboss-jakarta-batch-api_spec",
  "jboss-jboss-jakarta-concurrency-api",
  "jboss-jboss-jakarta-connector-api_spec",
  "jboss-jboss-jakarta-ejb-api_spec",
  "jboss-jboss-jakarta-el-api_spec",
  "jboss-jboss-jakarta-faces-api",
  "jboss-jboss-jakarta-interceptors-api_spec",
  "jboss-jboss-jakarta-jacc-api_spec",
  "jboss-jboss-jakarta-jaspi-api_spec",
  "jboss-jboss-jakarta-jax-rpc-api",
  "jboss-jboss-jakarta-jax-ws-api_spec",
  "jboss-jboss-jakarta-jaxb-api_spec",
  "jboss-jboss-jakarta-jaxrs-api_spec",
  "jboss-jboss-jakarta-jms-api",
  "jboss-jboss-jakarta-jsp-api_spec",
  "jboss-jboss-jakarta-jta-api",
  "jboss-jboss-jakarta-management-api",
  "jboss-jboss-jakarta-saaj-api_spec",
  "jboss-jboss-jakarta-servlet-api_spec",
  "jboss-jboss-jakarta-websocket-api",
  "jboss-jboss-jakartaee-8-specs",
  "jboss-jboss-jakartaee-8-specs - 1.0.0.Final",
  "jboss-jboss-jaspi-api_spec",
  "jboss-jboss-javaee-8-specs",
  "jboss-jboss-javaee-8-specs - 1.0.1.Final",
  "jboss-jboss-javaee-concurrency-api_spec",
  "jboss-jboss-jaxb-api_2.3_spec",
  "jboss-jboss-jaxrpc-api_spec",
  "jboss-jboss-jaxrs-api_2.1_spec",
  "jboss-jboss-jaxws-api_2.3_spec",
  "jboss-jboss-jms-api_spec",
  "jboss-jboss-jsf-api_spec - 2.3.5.SPx",
  "jboss-jboss-jsf-api_spec - 2.3.9.SPx",
  "jboss-jboss-jsp-api_spec",
  "jboss-jboss-parent-pom",
  "jboss-jboss-rmi-api_spec",
  "jboss-jboss-saaj-api_spec",
  "jboss-jboss-servlet-api_3.1_spec",
  "jboss-jboss-servlet-api_4.0_spec",
  "jboss-jboss-transaction-api_spec",
  "jboss-jboss-websocket-api_spec",
  "jboss-logging",
  "jboss-logging - 3.3.x",
  "jboss-logging-commons-logging-jboss-logging",
  "jboss-logging-jul-to-slf4j-stub",
  "jboss-logging-log4j-jboss-logmanager",
  "jboss-logging-log4j2-jboss-logmanager",
  "jboss-logging-slf4j-jboss-logmanager",
  "jboss-logmanager",
  "jboss-metadata",
  "jboss-mobile-json-patch",
  "jboss-mojarra",
  "jboss-mojarra - 2.3.5.SPx",
  "jboss-mojarra - 2.3.9.SPx",
  "jboss-negotiation",
  "jboss-openjdk-orb",
  "jboss-openjdk-orb-jdk9",
  "jboss-remoting-jboss-marshalling",
  "jboss-remoting-jboss-remoting",
  "jboss-remoting-xnio",
  "jboss-remoting-xnio - 3.7.6.SPx",
  "jboss-remoting-xnio - 3.7.x",
  "jboss-uel",
  "jboss-xalan-j",
  "jbossas-eap-datasources-galleon-pack",
  "jbossas-eap-quickstart-parent",
  "jbossas-jboss-classfilewriter",
  "jbossas-jboss-dmr",
  "jbossas-jboss-eap-xp-patch-stream-manager - 2.0.x",
  "jbossas-jboss-eap-xp-patch-stream-manager - 3.0.x",
  "jbossas-jboss-eap-xp-patch-stream-manager - 4.0.x",
  "jbossas-jboss-ejb-client",
  "jbossas-jboss-ejb-client-legacy",
  "jbossas-jboss-iiop-client",
  "jbossas-jboss-invocation",
  "jbossas-jboss-invocation - 1.5.x",
  "jbossas-jboss-modules",
  "jbossas-jboss-modules - 1.8.x",
  "jbossas-jboss-msc",
  "jbossas-jboss-seam-int",
  "jbossas-jboss-stdio",
  "jbossas-jboss-threads",
  "jbossas-jboss-vfs",
  "jbossas-jboss-xacml-main",
  "jbossas-remoting-jmx",
  "jbossas-staxmapper",
  "jbosstm-jboss-transaction-spi",
  "jbossws-jaxws-undertow-httpspi",
  "jbossws-jboss-jaxb-intros",
  "jbossws-jbossws-api",
  "jbossws-jbossws-common",
  "jbossws-jbossws-common-tools",
  "jbossws-jbossws-cxf",
  "jbossws-jbossws-parent",
  "jbossws-jbossws-spi",
  "jbossws-maven-parent",
  "jcip-annotations",
  "jdom",
  "jgroups-extras-jgroups-azure",
  "jgroups-extras-jgroups-kubernetes",
  "jhy-jsoup",
  "jms-ra-generic-jms-ra",
  "joda-time",
  "jsch",
  "jsr181-api",
  "jvnet-parent",
  "lemire-javaewah",
  "messaging-activemq-artemis",
  "messaging-activemq-artemis - 2.9.x",
  "messaging-activemq-artemis-libnative",
  "messaging-activemq-artemis-native",
  "modcluster-mod_cluster",
  "narayana",
  "narayana - 5.9.x",
  "netty-netty",
  "open-telemetry-opentelemetry-java",
  "opentracing-contrib-java-concurrent",
  "opentracing-contrib-java-interceptors",
  "opentracing-contrib-java-jaxrs",
  "opentracing-contrib-java-tracerresolver",
  "opentracing-contrib-java-web-servlet-filter",
  "opentracing-opentracing-java",
  "perfmark-perfmark",
  "picketbox",
  "picketbox-commons",
  "picketlink-bindings-25",
  "picketlink25",
  "projectodd-vdx",
  "prometheus-client_java",
  "raphw-byte-buddy",
  "reactive-streams-reactive-streams-jvm",
  "resteasy",
  "resteasy - 3.11.x",
  "resteasy - 3.15.x",
  "saaj-impl",
  "saaj-impl - 1.3.x",
  "shibboleth-java-opensaml",
  "shibboleth-java-parent-projects-java-parent-project-v3",
  "shibboleth-utilities-java-support",
  "slf4j",
  "smallrye-smallrye-common",
  "smallrye-smallrye-config",
  "smallrye-smallrye-fault-tolerance",
  "smallrye-smallrye-health",
  "smallrye-smallrye-health - 1.x",
  "smallrye-smallrye-jwt",
  "smallrye-smallrye-metrics",
  "smallrye-smallrye-mutiny",
  "smallrye-smallrye-open-api",
  "smallrye-smallrye-open-api - 1.1.x",
  "smallrye-smallrye-opentracing",
  "smallrye-smallrye-parent",
  "smallrye-smallrye-reactive-messaging",
  "smallrye-smallrye-reactive-utils",
  "snakeyaml",
  "sonatype-oss-parents",
  "spullara-mustache.java",
  "squareup-okhttp",
  "squareup-okio",
  "undertow-io-jastow",
  "undertow-io-undertow",
  "undertow-io-undertow - 2.0.30.SPx",
  "undertow-io-undertow - 2.0.x",
  "undertow-io-undertow-js",
  "vert-x3-vertx-dependencies",
  "vert-x3-vertx-ext-parent",
  "vert-x3-vertx-kafka-client",
  "vert-x3-vertx-parent",
  "vt-middleware-cryptacular",
  "weld-api",
  "weld-core",
  "weld-core - 3.0.x",
  "weld-parent",
  "wildfly-boms - 8.0.x",
  "wildfly-extras-wildfly-jar-maven-plugin - 2.0.x",
  "wildfly-extras-wildfly-jar-maven-plugin - 4.0.x",
  "wildfly-extras-wildfly-jar-maven-plugin - 6.1.x",
  "wildfly-jboss-ejb3-ext-api",
  "wildfly-openssl-linux-i386",
  "wildfly-openssl-linux-ppc64le",
  "wildfly-openssl-linux-rhel6-i386",
  "wildfly-openssl-linux-rhel6-x86_64",
  "wildfly-openssl-linux-rhel7-x86_64",
  "wildfly-openssl-linux-rhel8-x86_64",
  "wildfly-openssl-linux-s390x",
  "wildfly-openssl-linux-x86_64",
  "wildfly-openssl-solaris",
  "wildfly-openssl-windows",
  "wildfly-security-elytron-web",
  "wildfly-security-elytron-web - 1.2.x",
  "wildfly-security-elytron-web - 1.6.x",
  "wildfly-security-wildfly-elytron",
  "wildfly-security-wildfly-elytron - 1.10.x",
  "wildfly-security-wildfly-elytron - 1.15.x",
  "wildfly-security-wildfly-elytron - 1.6.x",
  "wildfly-security-wildfly-elytron-tool",
  "wildfly-security-wildfly-elytron-tool - 1.4.x",
  "wildfly-security-wildfly-openssl",
  "wildfly-security-wildfly-openssl-natives",
  "wildfly-wildfly - 7.3.x",
  "wildfly-wildfly - 7.4.x",
  "wildfly-wildfly - 8.0.x",
  "wildfly-wildfly-client-config",
  "wildfly-wildfly-common",
  "wildfly-wildfly-core",
  "wildfly-wildfly-core - 10.x",
  "wildfly-wildfly-core - 6.x",
  "wildfly-wildfly-discovery",
  "wildfly-wildfly-http-client",
  "wildfly-wildfly-http-client - 1.0.x",
  "wildfly-wildfly-naming-client",
  "wildfly-wildfly-openssl",
  "wildfly-wildfly-server-migration",
  "wildfly-wildfly-server-migration - 1.7.x",
  "wildfly-wildfly-transaction-client",
  "wsdl4j",
  "xerces2-j",
  "xml-commons",
  "xnio-netty-xnio-transport",
  "xom",
  "ymnk-jzlib"
]

const ComponentView = ({data}) => {
  const rows = data.upgrades.rows;
  const columns = ["Component", "Current", "New", "Link to Build Trigger"];
  const className = "component-view";

  const makeCells = (match, cell, rowIndex) => {
    if (match === null) {
      return (
        <Td key={`${rowIndex}_${0}`} dataLabel={columns[0].title} colSpan={3}>
          {cell.title}
        </Td>
      );
    }
    return (
      [0,1,2].map(i => {
        return (
          <Td key={`${rowIndex}_${i}`} dataLabel={columns[i].title}>
            {match[i+1]}
          </Td>
        );
      })
    );
  }

  const isSameVersion = (title, version) => {
    if (!version) return true;

    const titleRegex = /.* - (\d+\.\d+)\.x/,
          versionRegex = /(\d+\.\d+)\..*/,
          titleMatch = title.match(titleRegex),
          versionMatch = version.match(versionRegex);

    if (!titleMatch) return false;

    return titleMatch[1] === versionMatch[1];
  }

  const findCandidates = (title, version) => {
    const titleParts = title.split(" ");
    let candidates = new Map();
    buildProjects.filter(name => {
      for (let part of titleParts) {
        if (name.toLowerCase().indexOf(part) === -1) {
          return false;
        }
      }
      return true;
    }).forEach(c => candidates.set(c, false));

    candidates.forEach((_,c) => {
      if (c.toLowerCase() === title) {
        candidates.set(c, true);
        return;
      }

      let containsAll = true;
      for (let part of titleParts) {
        if (c.toLowerCase().indexOf(part) === -1) {
          containsAll = false;
        }
      }

      if (containsAll && isSameVersion(c, version)) candidates.set(c,true);
    })

    return Array.from(candidates.keys(), key => {
      if (candidates.get(key)) {
        return <><span><b>{key}</b></span><br/></>
      } else {
        return <><span>{key}</span><br/></>
      }
    });
  }

  const makeRow = (row, rowIndex) => {
    const cell = row.cells[4];
    const titleRegex = /.* [uU]pgrade (.*) from (.*) to (.*)/,
          match = cell.title.match(titleRegex);

    return (
      <>
        {makeCells(match, cell, rowIndex)}
        <Td key={`${rowIndex}_${3}`}>
          {match !== null && findCandidates(match[1].toLowerCase(), match[3])}
          {match === null && findCandidates(cell.title.toLowerCase())}
        </Td>
      </>
    );
  };


  return (
    <TableComposable className={className} variant="compact">
      <Thead>
        <Tr>
          {columns.map((column, columnIndex) => {
            return <Th key={columnIndex}>{column}</Th>;
          })}
        </Tr>
      </Thead>
      <Tbody>
        {rows.filter(row => row.cells[5].title === "UPGRADE").map((row, rowIndex) => (
          <Tr key={rowIndex}>
            {makeRow(row, rowIndex)}
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
}

export default ComponentView
