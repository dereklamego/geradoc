import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed, or use defaults
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 10,
    },
    companyInfo: {
        flexDirection: 'column',
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2563eb', // primary blue
    },
    docTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: '#F3F4F6',
        padding: 5,
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    label: {
        color: '#666',
    },
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 5,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingVertical: 5,
    },
    col1: { width: '60%' },
    col2: { width: '15%', textAlign: 'center' },
    col3: { width: '25%', textAlign: 'right' },
    total: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 2,
        borderTopColor: '#000',
        paddingTop: 10,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#999',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 10,
    },
    warranty: {
        marginTop: 20,
        fontSize: 9,
        fontStyle: 'italic',
        color: '#444',
    }
});

interface DocumentPDFProps {
    company: {
        name: string;
        document: string;
        phone: string;
        address: string;
    };
    client: {
        name: string;
        document: string;
        phone: string;
        address: string;
    };
    docType: string;
    services: Array<{
        name: string;
        price: number;
        description?: string;
    }>;
    total: number;
    date: string;
}

const DocumentPDF: React.FC<DocumentPDFProps> = ({ company, client, docType, services, total, date }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>{company.name || 'Sua Empresa'}</Text>
                    <Text>{company.document}</Text>
                    <Text>{company.phone}</Text>
                    <Text>{company.address}</Text>
                </View>
                <View>
                    <Text style={styles.docTitle}>{docType}</Text>
                    <Text style={{ textAlign: 'right' }}>Nº {Math.floor(Math.random() * 10000)}</Text>
                    <Text style={{ textAlign: 'right' }}>Data: {date}</Text>
                </View>
            </View>

            {/* Client Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dados do Cliente</Text>
                <View style={styles.row}>
                    <Text style={styles.col1}>{client.name}</Text>
                    <Text style={styles.col3}>{client.document}</Text>
                </View>
                <Text>{client.phone}</Text>
                <Text>{client.address}</Text>
            </View>

            {/* Services Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.col1}>Descrição do Serviço</Text>
                    <Text style={styles.col3}>Valor (R$)</Text>
                </View>
                {services.map((s, i) => (
                    <View key={i} style={styles.tableRow}>
                        <Text style={styles.col1}>{s.name}</Text>
                        <Text style={styles.col3}>{s.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={styles.total}>
                <Text style={styles.totalLabel}>TOTAL:</Text>
                <Text style={styles.totalValue}>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </View>

            {/* Warranty / Disclaimer */}
            <View style={styles.warranty}>
                <Text>Termos e Garantia:</Text>
                <Text>
                    Os serviços descritos neste documento possuem garantia conforme legislação vigente e prazos informados no momento da execução.
                    A garantia não cobre danos por mau uso, oscilações de energia ou intervenção de terceiros não autorizados.
                </Text>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                Gerado profissionalmente via GeraDoc - O sistema do prestador de serviços.
            </Text>
        </Page>
    </Document>
);

export default DocumentPDF;
