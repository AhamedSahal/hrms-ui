import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { camelize } from '../../utility';

const styles = StyleSheet.create({
    page: {
        fontSize: 11,
        flexDirection: "column",
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "10%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10
    }
});

const PdfDocument = ({ data }) => {
    let pageSize = "A4";
    let colSize = "10%";
    let colNames = Object.keys(data[0]);
    let colCount = colNames.length;
    let tableColStyle = styles.tableCol;
    if (colCount > 7) {
        pageSize = "A2";
        colSize = "6%";
    }
    if (colCount > 12) {
        pageSize = "A1";
        colSize = "5%";
    }
    if (colCount > 16) {
        pageSize = "A0";
        colSize = "4%";
    }
    if (colCount > 22) {
        pageSize = "2A0";
        colSize = "4%";
    }
    if (colCount > 27) {
        pageSize = "4A0";
        colSize = "3%";
    }
    if (colCount > 32) {
        pageSize = "4A0";
        colSize = "2.5%";
    }
    tableColStyle.width = colSize;
    return <Document>
        <Page size={pageSize} orientation={'landscape'} style={styles.page}>

            <View style={styles.table}>
                <View style={styles.tableRow}>
                    {colNames.map((key, i) => (
                        <View style={tableColStyle} key={i}>
                            <Text style={styles.tableCell}>{camelize(key)}</Text>
                        </View>
                    ))}
                </View>

                {data.map((item, i) => (
                    <View style={styles.tableRow}>
                        {Object.keys(item).map((key, i) => (
                            <View style={tableColStyle} key={i}>
                                <Text style={styles.tableCell}>{item[key]}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </Page>
    </Document>
}

export default PdfDocument;