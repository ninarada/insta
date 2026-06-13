import { useState } from 'react';
import { 
  Container, TextField, Button, Typography, Box, List, ListItem, 
  ListItemText, Paper, Card, CardContent, Link, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // Za otvaranje linka
import { useDropzone } from "react-dropzone";
import { compareLists } from './utils/compareLists';

function App() {
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const [error, setError] = useState('');

  const [unfollowers, setUnfollowers] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  const onDrop = (acceptedFiles) => {
    setError('');
    acceptedFiles.forEach((file) => {
      if (file.name === 'followers_1.json') {
        setFollowersFile(file);
      } else if (file.name === 'following.json') {
        setFollowingFile(file);
      } else {
        setError(`Datoteka "${file.name}" nije prepoznata. Molimo učitaj točno "followers_1.json" i "following.json".`);
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    multiple: true 
  });

  const removeFile = (type) => {
    if (type === 'followers') setFollowersFile(null);
    if (type === 'following') setFollowingFile(null);
  };

  const handleAnalyze = async () => {
    if (!followersFile || !followingFile) return;
    setError('');

    try {
      const readFileAsJson = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              resolve(JSON.parse(e.target.result));
            } catch (err) {
              reject(new Error(`Greška pri parsiranju datoteke ${file.name}.`));
            }
          };
          reader.onerror = () => reject(new Error(`Greška kod čitanja datoteke ${file.name}`));
          reader.readAsText(file);
        });
      };

      const [followersJson, followingJson] = await Promise.all([
        readFileAsJson(followersFile),
        readFileAsJson(followingFile)
      ]);

      const result = compareLists(followersJson, followingJson);

      setUnfollowers(result);
      setOpenPopup(true);

    } catch (err) {
      setError(err.message || 'Došlo je do greške prilikom analize datoteka.');
      console.error(err);
    }
  };

  const isReadyToAnalyze = followersFile && followingFile;

  return (
    <Box sx={{ p: 4, maxWidth: {xs: '80%', sm:'1200px'}, margin: '0 auto' }}>
      <Typography gutterBottom align="center" sx={{ color: '#ffffff', fontFamily: 'Rammetto One', fontSize: { xs: '30px', md: '50px' }}} >
        ničiji fan
      </Typography>

      <Typography sx={{fontWeight:'700', marginBottom: '40px', textAlign: 'center', fontSize:'18px'}}>
        Zalijepi listu svojih pratitelja i vidi tko te odpratio.
      </Typography>

      <Box sx={{display:'grid', gridTemplateColumns:{xs:'1fr', md:'1fr 1fr'}, gap:'40px'}}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>Upute </Typography>
            <List component="ol" sx={{listStyleType: "decimal", pl: 4, "& .MuiListItem-root": {display: "list-item", py: 0.5, },}} >
              <ListItem component="li">
                <ListItemText primary={
                    <>
                      Otvori{" "}
                      <Link href="https://accountscenter.instagram.com/" target="_blank" rel="noopener noreferrer" >
                        Instagram Accounts Center
                      </Link>
                      .
                    </>
                  }
                />
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={ <> U <strong>Account settings</strong> odaberi{" "} <strong>Your information and permissions</strong>. </> }/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> Klikni <strong>Export your information</strong>. </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> Odaberi <strong>Create export</strong>. </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> Odaberi gdje želiš spremiti podatke (na uređaj, e-mail ili drugu ponuđenu opciju). </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> U <strong>Customize information</strong> makni sve oznake i označi samo <strong>Followers and Following</strong> pod{" "} <strong>Connections</strong>. </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> U <strong>Date range</strong> odaberi{" "} <strong>All time</strong>. </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> Kao format odaberi <strong>JSON</strong>. </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> Klikni <strong>Start export</strong>. </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> Pričekaj da Instagram pošalje obavijest da je izvoz podataka dovršen. </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> Preuzmi generiranu arhivu s podacima. </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> Iz arhive pronađi datoteke <strong>following.json</strong> i{" "} <strong>followers_1.json</strong>. </>}/>
              </ListItem>
              <ListItem component="li">
                <ListItemText primary={<> Uploadaj obje datoteke i klikni <strong>Analiziraj</strong>. </>}/>
              </ListItem>
            </List>
          </CardContent>
        </Card>
        
        <Box sx={{placeContent:'center', display:'flex', flexDirection:'column', gap: '30px'}}>
          <Paper {...getRootProps()} variant="outlined" sx={{
              p: 5,
              padding:'100px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: isDragActive ? 'var(--accent)' : 'var(--border)',
              bgcolor: isDragActive ? 'var(--accent-bg)' : 'var(--bg)',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'var(--accent)',
              }
            }}
          >
            <input {...getInputProps()} />
            <Typography sx={{ color: 'var(--text)', fontWeight: 600, fontSize:'16px' }}>
              {isDragActive 
                ? "Ispusti datoteke ovdje..." 
                : "Povuci JSON datoteke ovdje ili klikni za odabir"}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text)', display: 'block', mt: 1, opacity: 0.7, fontSize:'14px' }}>
              Potrebne su: followers_1.json i following.json
            </Typography>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          {(followersFile || followingFile) && (
            <Paper sx={{ p: 2, bgcolor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <Typography variant="subtitle2" sx={{ color: 'var(--text-h)', mb: 1, textAlign: 'left', px: 2 }}>
                Odabrane datoteke:
              </Typography>
              <List dense>
                {followersFile && (
                  <ListItem 
                    secondaryAction={
                      <Button onClick={() => removeFile('followers')} color="error" size="small"><DeleteIcon /></Button>
                    }
                  >
                    <CheckCircleIcon sx={{ color: '#10b981', mr: 1, fontSize: '20px' }} />
                    <ListItemText primary={followersFile.name} sx={{ color: 'var(--text-h)' }} />
                  </ListItem>
                )}
                {followingFile && (
                  <ListItem 
                    secondaryAction={
                      <Button onClick={() => removeFile('following')} color="error" size="small"><DeleteIcon /></Button>
                    }
                  >
                    <CheckCircleIcon sx={{ color: '#10b981', mr: 1, fontSize: '20px' }} />
                    <ListItemText primary={followingFile.name} sx={{ color: 'var(--text-h)' }} />
                  </ListItem>
                )}
              </List>
            </Paper>
          )}

          <Button
            variant="contained"
            disabled={!isReadyToAnalyze}
            onClick={handleAnalyze}
            sx={{
              py: 1.5,
              borderRadius: '8px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '16px',
              width:'50%',
              placeSelf: 'center',
              bgcolor: isReadyToAnalyze ? 'var(--accent)' : 'var(--border)',
              color: isReadyToAnalyze ? '#fff' : 'var(--text)',
              '&:hover': {
                bgcolor: 'var(--accent-border)',
              }
            }}
          >
            Analiziraj
          </Button>
        </Box>
      </Box>

      <Dialog 
        open={openPopup} 
        onClose={() => setOpenPopup(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: { bgcolor: 'var(--bg)', borderRadius: '16px', p: 1 }
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 600, color: 'var(--text-h)', textAlign:'center' }}>
          Rezultat analize ({unfollowers.length})
        </DialogTitle>
        <DialogContent dividers>
          {unfollowers.length > 0 ? (
            <Box>
              <Typography sx={{ paddingBottom: '20px', color: 'var(--text)', fontFamily: 'Poppins', borderBottom: '1px solid var(--border)', opacity: 0.8, fontSize: '13px' }}>
                Među njima se možda nalaze deaktivirani profili pa klikni <strong>Provjeri</strong>. Ako se otvori Instagram i piše <em>"Profile isn't available"</em> to znači da je profil deaktiviran.
              </Typography>

              <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                {unfollowers.map((username, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ py: 0.5, borderBottom: '1px solid var(--border)' }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: '8px' }}>
                        <Button 
                          component="a" 
                          href={`https://www.instagram.com/${username}/`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          size="small"
                          variant="outlined"
                          startIcon={<OpenInNewIcon />}
                          sx={{ textTransform: 'none', fontFamily: 'Poppins' }}
                        >
                          Provjeri
                        </Button>
            
                      </Box>
                    }
                  >
                    <ListItemText 
                      primary={`@${username}`} 
                      sx={{ '& .MuiListItemText-primary': { color: 'var(--accent)', fontWeight: 500, fontFamily: 'Poppins' } }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <Typography sx={{ color: '#10b981', fontWeight: 600, fontFamily: 'Poppins' }}>
              Sve je čisto! Svi koje pratiš te prate natrag. 🎉
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenPopup(false)} 
            sx={{ color: 'var(--text)', fontFamily: 'Poppins', fontWeight: 600 }}
          >
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;