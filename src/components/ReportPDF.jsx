import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Helvetica',
    paddingTop: 50,
  },
  containerHeader: {
    width: '90%',
    border: '2pt solid black',
    borderRadius: 10,
    marginBottom: 20,
    textAlign: 'center',
    padding: 10, // Ajout du padding pour l'espace intérieur du border
  },
  containerInfo: {
    width: '90%',
    border: '1pt solid black',
    borderRadius: 20,
    marginBottom: 20,
    textAlign: 'start',
    padding: 10, // Ajout du padding pour l'espace intérieur du border
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 5,
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 12,
  },
});

// Component
const ReportPDF = ({ data }) => {
  const {
    Demandeur,
    NumDoss,
    Modele,
    NumRI,
    Couleur,
    NumSerieRec,
    NumSerieExp,
    Accessoires,
    PanneClient,
    PanneReparateur,
    EtatProduit,
    InterventionRealisee,
    Commentaire,
    Garantie,
    MotifRejetGarantie,
    Remarque,
    PanneDiagnostique,
    updatedAt,
  } = data;
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/*-------------------------------------HEADER------------------------------------------------*/}
        <View style={styles.containerHeader}>
          <Text style={styles.title}>RAPPORT D’INTERVENTION N° {NumRI}</Text>
          <Text style={styles.title}>{Demandeur}</Text>
        </View>

        {/*-------------------------------------FACTURE------------------------------------------------*/}
        <View
          style={[
            styles.containerHeader,
            styles.flex,
            { textAlign: 'start', border: '1pt solid black' },
          ]}
        >
          <View style={{ width: '50%' }}>
            <Text style={styles.infoLabel}>Numéro de Dossier : {NumDoss}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Date de clôture: {updatedAt}</Text>
          </View>
        </View>

        {/*-------------------------------------MATERIEL------------------------------------------------*/}
        <View style={styles.containerInfo}>
          <Text style={styles.subtitle}>Information MATERIEL :</Text>

          <View style={[styles.flex, { marginTop: '10' }]}>
            <View style={{ width: '50%' }}>
              <Text style={styles.infoLabel}>Modèle : {Modele}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Couleur : {Couleur}</Text>
            </View>
          </View>

          <View style={[styles.flex, { margin: '10 0 5 0' }]}>
            <View style={{ width: '50%' }}>
              <Text style={styles.infoLabel}>
                N° série Réceptionné : {NumSerieRec}
              </Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>
                N° série Expédié : {NumSerieExp}
              </Text>
            </View>
          </View>
          <Text style={[styles.infoLabel, { marginTop: '10' }]}>
            Accessoires réceptionnés : {Accessoires}
          </Text>
          <Text style={[styles.infoLabel, { marginTop: '10' }]}>
            Panne déclarée par le client : {PanneClient}
          </Text>
          <Text style={[styles.infoLabel, { marginTop: '10' }]}>
            Description de la panne : {PanneReparateur}
          </Text>
          <Text style={[styles.infoLabel, { marginTop: '10' }]}>
            Etat du produit à Réception : {EtatProduit}
          </Text>
          <Text style={[styles.infoLabel, { marginTop: '10' }]}>
            Remarque à la réception : {Remarque}
          </Text>
        </View>

        {/*------------------------------------SAV-------------------------------------------------*/}
        <View style={styles.containerInfo}>
          <Text style={styles.subtitle}>Information TRAITEMENT SAV :</Text>

          <View style={[styles.flex, { marginTop: '10' }]}>
            <View style={{ width: '50%' }}>
              <Text style={styles.infoLabel}>Garantie : {Garantie}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>
                Motif de rejet de la garantie : {MotifRejetGarantie}
              </Text>
            </View>
          </View>

          <Text style={[styles.infoLabel, { marginTop: '10' }]}>
            Panne(s) Diagnostiquée(s) : {PanneDiagnostique}
          </Text>
          <Text style={[styles.infoLabel, { marginTop: '10' }]}>
            Commentaire Panne : {Commentaire}
          </Text>
          <Text style={[styles.infoLabel, { marginTop: '10' }]}>
            Interventions réalisées par le technicien : {InterventionRealisee}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportPDF;
